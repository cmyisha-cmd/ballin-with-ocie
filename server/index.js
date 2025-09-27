import express from 'express';
import cors from 'cors';
import pkg from 'pg';

const { Pool } = pkg;

const app = express();
const PORT = process.env.PORT || 3001;
const DATABASE_URL = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: DATABASE_URL?.includes('render.com') || process.env.PGSSLMODE === 'require'
    ? { rejectUnauthorized: false }
    : false
});

app.use(cors({ origin: true }));
app.use(express.json());

// Migration function
async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS players (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      age TEXT,
      shooting BOOLEAN DEFAULT FALSE,
      team BOOLEAN DEFAULT FALSE,
      score INTEGER DEFAULT 0,
      time TEXT DEFAULT '00:00',
      team_group TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS tickets (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      text TEXT NOT NULL,
      reactions JSONB DEFAULT '{}'::jsonb,
      replies JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
}
await migrate();

// Helpers
function ok(res, data) { return res.json(data); }
function bad(res, msg='Bad Request', code=400){ return res.status(code).json({message: msg}); }
function notFound(res, msg='Not Found'){ return res.status(404).json({message: msg}); }
function adminOK(req){ return req.headers['x-admin-pass'] === 'ocie2025'; }

// Health check
app.get('/api/health', (req,res)=> ok(res,{ok:true}));

// Registration
app.post('/api/register', async (req,res)=>{
  try{
    const { name, age, shooting=false, team=false } = req.body || {};
    if(!name) return bad(res,'Name required');
    const { rows } = await pool.query(
      `INSERT INTO players(name,age,shooting,team) VALUES($1,$2,$3,$4) RETURNING *`,
      [name, String(age||''), !!shooting, !!team]
    );
    ok(res, rows[0]);
  }catch(e){ console.error(e); bad(res,'Register failed',500); }
});
app.get('/api/players', async (req,res)=>{
  try{ const { rows } = await pool.query(`SELECT * FROM players ORDER BY id DESC`); ok(res, rows); }
  catch(e){ console.error(e); bad(res,'Failed to load players',500); }
});

// Tickets
app.post('/api/tickets', async (req,res)=>{
  try{
    const { name, quantity } = req.body || {};
    const qty = Number(quantity||0);
    if(!name || !qty) return bad(res, 'Name and quantity required');
    const { rows } = await pool.query(`INSERT INTO tickets(name,quantity) VALUES($1,$2) RETURNING *`, [name, qty]);
    ok(res, rows[0]);
  }catch(e){ console.error(e); bad(res,'Ticket request failed',500); }
});
app.get('/api/tickets', async (req,res)=>{
  try{ const { rows } = await pool.query(`SELECT * FROM tickets ORDER BY id DESC`); ok(res, rows); }
  catch(e){ console.error(e); bad(res,'Failed to load tickets',500); }
});

// Shooting
app.get('/api/shooting', async (req,res)=>{
  try{
    const { rows } = await pool.query(`SELECT id,name,score,time FROM players WHERE shooting=true ORDER BY id DESC`);
    ok(res, rows);
  }catch(e){ console.error(e); bad(res,'Failed to load shooting',500); }
});
app.patch('/api/shooting/:id', async (req,res)=>{
  try{
    const id = Number(req.params.id);
    const { score = 0, time='00:00' } = req.body || {};
    const { rows } = await pool.query(`UPDATE players SET score=$1, time=$2 WHERE id=$3 RETURNING *`, [Number(score||0), String(time||'00:00'), id]);
    if(!rows.length) return notFound(res);
    ok(res, rows[0]);
  }catch(e){ console.error(e); bad(res,'Update failed',500); }
});

// Teams
app.get('/api/teams', async (req,res)=>{
  try{
    const { rows } = await pool.query(`SELECT id,name,team_group FROM players WHERE team=true ORDER BY id ASC`);
    const A = [], B = [];
    rows.forEach(p => {
      if(p.team_group === 'A') A.push({id:p.id,name:p.name});
      else if(p.team_group === 'B') B.push({id:p.id,name:p.name});
    });
    ok(res, { A, B });
  }catch(e){ console.error(e); bad(res,'Failed to load teams',500); }
});
app.post('/api/teams/auto', async (req,res)=>{
  try{
    if(!adminOK(req)) return bad(res,'Unauthorized',401);
    const { rows } = await pool.query(`SELECT id FROM players WHERE team=true ORDER BY id ASC`);
    await Promise.all(rows.map((r,i)=> pool.query(`UPDATE players SET team_group=$1 WHERE id=$2`, [i%2===0?'A':'B', r.id])));
    ok(res, { message: 'Teams auto-assigned' });
  }catch(e){ console.error(e); bad(res,'Auto-assign failed',500); }
});

// Messages
app.get('/api/messages', async (req,res)=>{
  try{
    const { rows } = await pool.query(`SELECT id,name,text,reactions,replies,created_at FROM messages ORDER BY id DESC`);
    ok(res, rows);
  }catch(e){ console.error(e); bad(res,'Failed to load messages',500); }
});
app.post('/api/messages', async (req,res)=>{
  try{
    const { name, text } = req.body || {};
    if(!name || !text) return bad(res, 'Name and text required');
    const { rows } = await pool.query(`INSERT INTO messages(name,text) VALUES($1,$2) RETURNING *`, [name, text]);
    ok(res, rows[0]);
  }catch(e){ console.error(e); bad(res,'Post failed',500); }
});
app.post('/api/messages/:id/react', async (req,res)=>{
  try{
    const id = Number(req.params.id);
    const { emoji } = req.body || {};
    if(!emoji) return bad(res, 'Emoji required');
    const cur = await pool.query(`SELECT reactions FROM messages WHERE id=$1`, [id]);
    if(!cur.rows.length) return notFound(res);
    const reactions = cur.rows[0].reactions || {};
    reactions[emoji] = (reactions[emoji] || 0) + 1;
    const { rows } = await pool.query(`UPDATE messages SET reactions=$1 WHERE id=$2 RETURNING *`, [reactions, id]);
    ok(res, rows[0]);
  }catch(e){ console.error(e); bad(res,'React failed',500); }
});

// ✅ Replies with safe JSON parsing
app.post('/api/messages/:id/reply', async (req,res)=>{
  try{
    const id = Number(req.params.id);
    const { name, text } = req.body || {};
    if(!name || !text) return bad(res, 'Name and text required');

    const cur = await pool.query(`SELECT replies FROM messages WHERE id=$1`, [id]);
    if(!cur.rows.length) return notFound(res);

    let replies = cur.rows[0].replies;

    if (typeof replies === 'string') {
      try { replies = JSON.parse(replies) } catch { replies = [] }
    }
    if (!Array.isArray(replies)) replies = [];

    replies.push({ id: Date.now(), name, text });

    const { rows } = await pool.query(
      `UPDATE messages SET replies=$1 WHERE id=$2 RETURNING *`,
      [JSON.stringify(replies), id]
    );

    ok(res, rows[0]);
  }catch(e){ console.error(e); bad(res,'Reply failed',500); }
});

// Delete message (admin only)
app.delete('/api/messages/:id', async (req,res)=>{
  try{
    if(!adminOK(req)) return bad(res,'Unauthorized',401);
    const id = Number(req.params.id);
    const { rowCount } = await pool.query(`DELETE FROM messages WHERE id=$1`, [id]);
    if(rowCount === 0) return notFound(res);
    ok(res, { message: 'Message deleted' });
  }catch(e){ console.error(e); bad(res,'Delete failed',500); }
});

// Admin Reset Data
app.post('/api/reset', async (req,res)=>{
  try{
    if(!adminOK(req)) return bad(res,'Unauthorized',401);
    await pool.query(`TRUNCATE tickets RESTART IDENTITY; TRUNCATE players RESTART IDENTITY; TRUNCATE messages RESTART IDENTITY;`);
    ok(res, { message: 'All data cleared' });
  }catch(e){ console.error(e); bad(res,'Reset failed',500); }
});

// Admin Reset Schema
app.get('/api/reset-schema', async (req,res)=>{
  try{
    if(!adminOK(req)) return bad(res,'Unauthorized',401);
    await pool.query(`
      DROP TABLE IF EXISTS players CASCADE;
      DROP TABLE IF EXISTS tickets CASCADE;
      DROP TABLE IF EXISTS messages CASCADE;
    `);
    await migrate();
    res.json({ message: 'Schema reset complete' });
  }catch(e){
    console.error('Reset schema failed', e);
    res.status(500).json({ message: 'Schema reset failed', error: e.message });
  }
});

// --- Admin Delete/Update Endpoints (DB-backed) ---

// Delete a shooter (player flagged as shooting)
app.delete("/api/shooting/:id", async (req, res) => {
  try {
    if (!adminOK(req)) return bad(res, "Unauthorized", 401);
    const id = Number(req.params.id);
    const { rowCount } = await pool.query(
      `DELETE FROM players WHERE id=$1 AND shooting=true`,
      [id]
    );
    if (rowCount === 0) return notFound(res);
    ok(res, { message: "Shooter deleted" });
  } catch (e) {
    console.error(e);
    bad(res, "Delete failed", 500);
  }
});

// Delete a player
app.delete("/api/players/:id", async (req, res) => {
  try {
    if (!adminOK(req)) return bad(res, "Unauthorized", 401);
    const id = Number(req.params.id);
    const { rowCount } = await pool.query(`DELETE FROM players WHERE id=$1`, [id]);
    if (rowCount === 0) return notFound(res);
    ok(res, { message: "Player deleted" });
  } catch (e) {
    console.error(e);
    bad(res, "Delete failed", 500);
  }
});

// Update ticket quantity
app.patch("/api/tickets/:id", async (req, res) => {
  try {
    if (!adminOK(req)) return bad(res, "Unauthorized", 401);
    const id = Number(req.params.id);
    const { quantity } = req.body || {};
    const qty = Number(quantity);
    if (!qty) return bad(res, "Quantity required");
    const { rows } = await pool.query(
      `UPDATE tickets SET quantity=$1 WHERE id=$2 RETURNING *`,
      [qty, id]
    );
    if (!rows.length) return notFound(res);
    ok(res, rows[0]);
  } catch (e) {
    console.error(e);
    bad(res, "Update failed", 500);
  }
});

// Delete a team member
app.delete("/api/teams/:team/:id", async (req, res) => {
  try {
    if (!adminOK(req)) return bad(res, "Unauthorized", 401);
    const { team, id } = req.params;
    await pool.query(
      `UPDATE players SET team_group=NULL WHERE id=$1 AND team_group=$2`,
      [id, team]
    );
    ok(res, { message: "Team member removed" });
  } catch (e) {
    console.error(e);
    bad(res, "Delete failed", 500);
  }
});

// Add a new team member
app.post("/api/teams/:team", async (req, res) => {
  try {
    if (!adminOK(req)) return bad(res, "Unauthorized", 401);
    const { team } = req.params;
    const { name } = req.body;
    if (!name) return bad(res, "Name required");
    const { rows } = await pool.query(
      `INSERT INTO players(name,team,team_group) VALUES($1,true,$2) RETURNING id,name,team_group`,
      [name, team]
    );
    ok(res, rows[0]);
  } catch (e) {
    console.error(e);
    bad(res, "Add failed", 500);
  }
});

// Rename a team member
app.patch("/api/teams/:team/:id", async (req, res) => {
  try {
    if (!adminOK(req)) return bad(res, "Unauthorized", 401);
    const { id } = req.params;
    const { name } = req.body;
    if (!name) return bad(res, "Name required");
    const { rows } = await pool.query(
      `UPDATE players SET name=$1 WHERE id=$2 RETURNING id,name,team_group`,
      [name, id]
    );
    if (!rows.length) return notFound(res);
    ok(res, rows[0]);
  } catch (e) {
    console.error(e);
    bad(res, "Rename failed", 500);
  }
});

// --- Start server ---
app.listen(PORT, ()=> console.log(`Server listening on ${PORT}`));
