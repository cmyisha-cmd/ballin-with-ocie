import express from 'express';
import cors from 'cors';
import pkg from 'pg';

const { Pool } = pkg;

const app = express();

// --- CORS (keep wide-open while testing; tighten later if you want)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH'],
  allowedHeaders: ['Content-Type', 'x-admin-pass']
}));
app.use(express.json());

// --- ENV (set in Render → Environment)
// DATABASE_URL: provided by Render Postgres (e.g. postgres://...)
// ADMIN_PASS: optional; default provided here
const ADMIN_PASS = process.env.ADMIN_PASS || 'ocie2025';

// --- Postgres connection pool (Render needs SSL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// --- Run simple helper
async function q(text, params = []) {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
}

// --- Bootstrap: create tables if not exist
async function initDB() {
  await q(`
    CREATE TABLE IF NOT EXISTS players (
      id BIGINT PRIMARY KEY,
      name TEXT NOT NULL,
      age INT NOT NULL,
      shooting BOOLEAN DEFAULT FALSE,
      team BOOLEAN DEFAULT FALSE,
      score INT DEFAULT 0,
      time TEXT DEFAULT '00:00',
      team_group TEXT,      -- 'A' | 'B' | NULL
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await q(`
    CREATE TABLE IF NOT EXISTS tickets (
      id BIGSERIAL PRIMARY KEY,
      buyer TEXT NOT NULL,
      quantity INT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await q(`
    CREATE TABLE IF NOT EXISTS messages (
      id BIGSERIAL PRIMARY KEY,
      author TEXT NOT NULL,
      text TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
}
initDB().catch(err => {
  console.error('DB init error:', err);
  process.exit(1);
});

// --- Helpers
const newId = () => Date.now(); // keep same style used before

// ======================================
// ============== ROUTES ================
// ======================================

// Health
app.get('/', (_req, res) => {
  res.send('Ballin with Ocie server (Postgres) is running 🚀');
});

// ----- Registration -----
app.post('/api/register', async (req, res) => {
  try {
    const { name, age, shooting, team } = req.body || {};
    if (!name || !age) {
      return res.status(400).json({ message: 'Name and age required' });
    }
    const id = newId();

    // Insert player
    await q(
      `INSERT INTO players (id, name, age, shooting, team, score, time, team_group)
       VALUES ($1,$2,$3,$4,$5,0,'00:00',NULL)`,
      [id, String(name), Number(age), !!shooting, !!team]
    );

    // If team was selected, do a simple balance between A/B immediately (optional)
    if (team) {
      const { rows: counts } = await q(`
        WITH counts AS (
          SELECT
            SUM(CASE WHEN team_group='A' THEN 1 ELSE 0 END) AS a_count,
            SUM(CASE WHEN team_group='B' THEN 1 ELSE 0 END) AS b_count
          FROM players
        )
        SELECT a_count, b_count FROM counts;
      `);
      const a = Number(counts[0]?.a_count || 0);
      const b = Number(counts[0]?.b_count || 0);
      const group = a <= b ? 'A' : 'B';
      await q(`UPDATE players SET team_group=$1 WHERE id=$2`, [group, id]);
    }

    res.json({ message: 'Registered successfully!' });
  } catch (err) {
    console.error('register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ----- Tickets -----
app.post('/api/tickets', async (req, res) => {
  try {
    const { buyer, quantity } = req.body || {};
    if (!buyer || !quantity) {
      return res.status(400).json({ message: 'Buyer and quantity required' });
    }
    await q(
      `INSERT INTO tickets (buyer, quantity) VALUES ($1,$2)`,
      [String(buyer), Number(quantity)]
    );
    res.json({ message: 'Tickets purchased successfully!' });
  } catch (err) {
    console.error('tickets error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ----- Message Board -----
app.post('/api/message', async (req, res) => {
  try {
    const { author, text } = req.body || {};
    if (!author || !text) {
      return res.status(400).json({ message: 'Author and text required' });
    }
    await q(
      `INSERT INTO messages (author, text) VALUES ($1,$2)`,
      [String(author), String(text)]
    );
    res.json({ message: 'Message posted successfully!' });
  } catch (err) {
    console.error('message error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ----- Admin Login (simple) -----
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {};
  if (password === ADMIN_PASS) return res.json({ ok: true });
  return res.status(403).json({ ok: false, message: 'Invalid password' });
});

// ----- GET: Players / Tickets / Messages -----
app.get('/api/players', async (_req, res) => {
  try {
    const { rows } = await q(`SELECT * FROM players ORDER BY created_at DESC`);
    res.json(rows);
  } catch (err) {
    console.error('get players error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/tickets', async (_req, res) => {
  try {
    const { rows } = await q(`SELECT * FROM tickets ORDER BY created_at DESC`);
    // keep shape compatible with existing Admin.jsx (buyer or name)
    const normalized = rows.map(r => ({
      id: r.id,
      buyer: r.buyer,
      name: r.buyer,           // legacy compatibility
      quantity: r.quantity,
      created_at: r.created_at
    }));
    res.json(normalized);
  } catch (err) {
    console.error('get tickets error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/messages', async (_req, res) => {
  try {
    const { rows } = await q(`SELECT * FROM messages ORDER BY created_at DESC`);
    res.json(rows);
  } catch (err) {
    console.error('get messages error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ----- Shooting Leaderboard -----
// Return players who opted into shooting, with sorting: score DESC, time ASC
// time format stored as 'MM:SS'; we parse into seconds in SQL for sorting.
app.get('/api/shooting', async (_req, res) => {
  try {
    const { rows } = await q(`
      SELECT id, name, age, shooting, team, score, time, team_group, created_at
      FROM players
      WHERE shooting = TRUE
      ORDER BY score DESC,
        COALESCE(
          (NULLIF(split_part(time, ':', 1), '')::int * 60
            + NULLIF(split_part(time, ':', 2), '')::int),
          999999
        ) ASC,
        created_at ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error('get shooting error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a shooter’s score/time
app.patch('/api/shooting/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { score, time } = req.body || {};
    const s = Number(score || 0);
    const t = time && /^\d{1,2}:\d{2}$/.test(time) ? time : '00:00';

    const upd = await q(
      `UPDATE players SET score=$1, time=$2 WHERE id=$3 AND shooting=TRUE`,
      [s, t, id]
    );
    if (upd.rowCount === 0) {
      return res.status(404).json({ message: 'Player not found or not in shooting contest' });
    }
    res.json({ message: 'Score updated' });
  } catch (err) {
    console.error('patch shooting error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ----- Teams (A/B) -----
app.get('/api/teams', async (_req, res) => {
  try {
    const { rows } = await q(`
      SELECT id, name, team_group FROM players WHERE team_group IS NOT NULL ORDER BY name ASC
    `);
    const A = rows.filter(r => r.team_group === 'A').map(r => ({ id: r.id, name: r.name }));
    const B = rows.filter(r => r.team_group === 'B').map(r => ({ id: r.id, name: r.name }));
    res.json({ A, B });
  } catch (err) {
    console.error('get teams error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Auto-assign teams alternating A/B across all players who opted into team play
app.post('/api/teams/auto', async (req, res) => {
  try {
    if (req.headers['x-admin-pass'] !== ADMIN_PASS) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { rows: teamPlayers } = await q(
      `SELECT id FROM players WHERE team = TRUE ORDER BY created_at ASC`
    );
    for (let i = 0; i < teamPlayers.length; i++) {
      const group = i % 2 === 0 ? 'A' : 'B';
      await q(`UPDATE players SET team_group=$1 WHERE id=$2`, [group, teamPlayers[i].id]);
    }
    res.json({ message: 'Teams auto-assigned' });
  } catch (err) {
    console.error('teams auto error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ----- Reset all data (admin only) -----
app.post('/api/reset', async (req, res) => {
  try {
    if (req.headers['x-admin-pass'] !== ADMIN_PASS) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    // truncate tables
    await q(`TRUNCATE TABLE messages, tickets, players RESTART IDENTITY`);
    res.json({ message: 'All data cleared' });
  } catch (err) {
    console.error('reset error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Postgres server running on port ${PORT}`);
});
