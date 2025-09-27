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

// Migration
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
    CREATE TABLE IF NOT EXISTS games (
      id SERIAL PRIMARY KEY,
      round TEXT NOT NULL,
      team1 TEXT,
      team2 TEXT,
      score1 INTEGER DEFAULT 0,
      score2 INTEGER DEFAULT 0
    );
  `);
}
await migrate();

function ok(res, data){ return res.json(data); }
function bad(res, msg='Bad Request', code=400){ return res.status(code).json({message: msg}); }
function notFound(res, msg='Not Found'){ return res.status(404).json({message: msg}); }
function adminOK(req){ return req.headers['x-admin-pass'] === 'ocie2025'; }

// Health check
app.get('/api/health',(req,res)=> ok(res,{ok:true}));

// Players
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
  try{
    const { rows } = await pool.query(`SELECT * FROM players ORDER BY id DESC`);
    ok(res, rows);
  }catch(e){ console.error(e); bad(res,'Failed to load players',500); }
});

// Tickets
app.post('/api/tickets', async (req,res)=>{
  try{
    const { name, quantity } = req.body || {};
    if(!name || !quantity) return bad(res,'Name and quantity required');
    const qty = Number(quantity||0);
    const { rows } = await pool.query(`INSERT INTO tickets(name,quantity) VALUES($1,$2) RETURNING *`, [name, qty]);
    ok(res, rows[0]);
  }catch(e){ console.error(e); bad(res,'Ticket request failed',500); }
});
app.get('/api/tickets', async (req,res)=>{
  try{
    const { rows } = await pool.query(`SELECT * FROM tickets ORDER BY id DESC`);
    ok(res, rows);
  }catch(e){ console.error(e); bad(res,'Failed to load tickets',500); }
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
    const { score=0, time='00:00' } = req.body || {};
    const { rows } = await pool.query(`UPDATE players SET score=$1,time=$2 WHERE id=$3 RETURNING *`, [Number(score), String(time), id]);
    if(!rows.length) return notFound(res);
    ok(res, rows[0]);
  }catch(e){ console.error(e); bad(res,'Update failed',500); }
});
app.delete('/api/shooting/:id', async (req,res)=>{
  try{
    if(!adminOK(req)) return bad(res,'Unauthorized',401);
    const id = Number(req.params.id);
    const { rowCount } = await pool.query(`DELETE FROM players WHERE id=$1 AND shooting=true`, [id]);
    if(rowCount===0) return notFound(res);
    ok(res,{message:'Deleted'});
  }catch(e){ console.error(e); bad(res,'Delete failed',500); }
});

// ✅ Messages
app.get('/api/messages', async (req,res)=>{
  try{
    const { rows } = await pool.query(`SELECT id,name,text,reactions,replies,created_at FROM messages ORDER BY id DESC`);
    ok(res, rows);
  }catch(e){ console.error(e); bad(res,'Failed to load messages',500); }
});
app.post('/api/messages', async (req,res)=>{
  try{
    const { name, text } = req.body || {};
    if(!name || !text) return bad(res,'Name and text required');
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
app.post('/api/messages/:id/reply', async (req,res)=>{
  try{
    const id = Number(req.params.id);
    const { name, text } = req.body || {};
    if(!name || !text) return bad(res,'Name and text required');

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
app.delete('/api/messages/:id', async (req,res)=>{
  try{
    if(!adminOK(req)) return bad(res,'Unauthorized',401);
    const id = Number(req.params.id);
    const { rowCount } = await pool.query(`DELETE FROM messages WHERE id=$1`, [id]);
    if(rowCount === 0) return notFound(res);
    ok(res, { message: 'Message deleted' });
  }catch(e){ console.error(e); bad(res,'Delete failed',500); }
});

// Bracket, Teams, Reset (your existing code for those)...

app.listen(PORT,()=> console.log(`Server running on ${PORT}`));
