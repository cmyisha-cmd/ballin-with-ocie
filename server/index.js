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
    CREATE TABLE IF NOT EXISTS games (
      id SERIAL PRIMARY KEY,
      round TEXT NOT NULL,
      game_no INTEGER NOT NULL,
      team1 TEXT,
      team2 TEXT,
      score1 INTEGER DEFAULT 0,
      score2 INTEGER DEFAULT 0,
      next_game_id INTEGER,
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
    const groups = {};
    rows.forEach(p => {
      if(!groups[p.team_group]) groups[p.team_group] = [];
      groups[p.team_group].push({id:p.id,name:p.name});
    });
    ok(res, groups);
  }catch(e){ console.error(e); bad(res,'Failed to load teams',500); }
});

// ✅ Balanced Auto Assign Teams
app.post('/api/teams/auto', async (req,res)=>{
  try{
    if(!adminOK(req)) return bad(res,'Unauthorized',401);

    const { rows: plist } = await pool.query(
      `SELECT id FROM players WHERE team=true ORDER BY id ASC`
    );
    const n = plist.length;
    if(n < 2) return bad(res,'Need at least 2 team players');

    let teamCount = 2;
    const maxK = Math.min(26, n);
    for(let k=maxK; k>=2; k--){
      const base = Math.floor(n / k);
      const rem  = n % k;
      const maxSize = base + (rem > 0 ? 1 : 0);
      const minSize = base;
      if(minSize >= 3 && maxSize <= 5){
        teamCount = k;
        break;
      }
    }

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.slice(0, teamCount).split('');
    const buckets = Array.from({length: teamCount}, ()=>[]);
    plist.forEach((p, i)=> buckets[i % teamCount].push(p.id));

    await pool.query(`UPDATE players SET team_group=NULL WHERE team=true`);
    for(let i=0;i<buckets.length;i++){
      const ids = buckets[i];
      if(ids.length){
        await pool.query(
          `UPDATE players SET team_group=$1 WHERE id = ANY($2::int[])`,
          [letters[i], ids]
        );
      }
    }

    ok(res,{ message:`Auto-assigned ${teamCount} team(s)`, teams:letters });
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

// Replies
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

// Reset data
app.post('/api/reset', async (req,res)=>{
  try{
    if(!adminOK(req)) return bad(res,'Unauthorized',401);
    await pool.query(`TRUNCATE tickets RESTART IDENTITY; TRUNCATE players RESTART IDENTITY; TRUNCATE messages RESTART IDENTITY; TRUNCATE games RESTART IDENTITY;`);
    ok(res, { message: 'All data cleared' });
  }catch(e){ console.error(e); bad(res,'Reset failed',500); }
});

// Reset schema
app.get('/api/reset-schema', async (req,res)=>{
  try{
    if(!adminOK(req)) return bad(res,'Unauthorized',401);
    await pool.query(`
      DROP TABLE IF EXISTS players CASCADE;
      DROP TABLE IF EXISTS tickets CASCADE;
      DROP TABLE IF EXISTS messages CASCADE;
      DROP TABLE IF EXISTS games CASCADE;
    `);
    await migrate();
    res.json({ message: 'Schema reset complete' });
  }catch(e){
    console.error('Reset schema failed', e);
    res.status(500).json({ message: 'Schema reset failed', error: e.message });
  }
});

// --- Bracket helpers & routes ---
async function getActiveTeamLetters(){
  const { rows } = await pool.query(`
    SELECT DISTINCT team_group AS tg
    FROM players
    WHERE team=true AND team_group IS NOT NULL
    ORDER BY tg ASC
  `);
  return rows.map(r=>r.tg).filter(Boolean);
}

app.get('/api/bracket', async (req,res)=>{
  try{
    const { rows } = await pool.query(`SELECT * FROM games ORDER BY round ASC, game_no ASC, id ASC`);
    const byRound = rows.reduce((acc,g)=>{
      (acc[g.round] = acc[g.round] || []).push(g);
      return acc;
    },{});
    ok(res, byRound);
  }catch(e){ console.error(e); bad(res,'Failed to load bracket',500); }
});

app.post('/api/bracket/generate', async (req,res)=>{
  try{
    if(!adminOK(req)) return bad(res,'Unauthorized',401);
    const letters = await getActiveTeamLetters();
    if(!(letters.length === 2 || letters.length === 4)){
      return bad(res, 'Bracket generation supported only for 2 or 4 teams currently');
    }

    await pool.query(`DELETE FROM games`);

    if(letters.length === 2){
      const { rows } = await pool.query(
        `INSERT INTO games(round, game_no, team1, team2) VALUES('final', 1, $1, $2) RETURNING *`,
        [letters[0], letters[1]]
      );
      return ok(res, { message:'Final created', games: rows });
    }

    if(letters.length === 4){
      const [A,B,C,D] = letters;
      const semi1 = await pool.query(
        `INSERT INTO games(round, game_no, team1, team2) VALUES('semi', 1, $1, $2) RETURNING *`,
        [A, D]
      );
      const semi2 = await pool.query(
        `INSERT INTO games(round, game_no, team1, team2) VALUES('semi', 2, $1, $2) RETURNING *`,
        [B, C]
      );
      const final = await pool.query(
        `INSERT INTO games(round, game_no) VALUES('final', 1) RETURNING *`
      );
      const finalId = final.rows[0].id;
      await pool.query(`UPDATE games SET next_game_id=$1 WHERE id=$2`, [finalId, semi1.rows[0].id]);
      await pool.query(`UPDATE games SET next_game_id=$1 WHERE id=$2`, [finalId, semi2.rows[0].id]);
      return ok(res, { message:'Bracket created: 2 semis + final' });
    }
  }catch(e){ console.error(e); bad(res,'Bracket generation failed',500); }
});

app.patch('/api/games/:id', async (req,res)=>{
  try{
    if(!adminOK(req)) return bad(res,'Unauthorized',401);
    const id = Number(req.params.id);
    const { score1=0, score2=0 } = req.body || {};
    const { rows } = await pool.query(
      `UPDATE games SET score1=$1, score2=$2 WHERE id=$3 RETURNING *`,
      [Number(score1||0), Number(score2||0), id]
    );
    if(!rows.length) return notFound(res);
    const game = rows[0];

    if(game.score1 != null && game.score2 != null && game.next_game_id){
      const winner = game.score1 > game.score2 ? game.team1
                    : game.score2 > game.score1 ? game.team2
                    : null;
      if(winner){
        const nxt = await pool.query(`SELECT * FROM games WHERE id=$1`, [game.next_game_id]);
        if(nxt.rows.length){
          const ng = nxt.rows[0];
          if(!ng.team1){
            await pool.query(`UPDATE games SET team1=$1 WHERE id=$2`, [winner, ng.id]);
          }else if(!ng.team2){
            await pool.query(`UPDATE games SET team2=$1 WHERE id=$2`, [winner, ng.id]);
          }
        }
      }
    }

    ok(res, game);
  }catch(e){ console.error(e); bad(res,'Update score failed',500); }
});

// Start server
app.listen(PORT, ()=> console.log(`Server listening on ${PORT}`));
