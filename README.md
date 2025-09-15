# Ballin' with Ocie — Live Test Build

## Run locally (Docker)
```bash
docker compose up --build
# open http://localhost:4000
```

## Deploy
- **Render (backend)**: start `node server/index.js`
- **Vercel (frontend)**: uses `vercel.json` and `frontend`

## API
- POST /api/register  → { name, age, events:{shooting,team}, contact }
- POST /api/tickets   → { name, count, contact }
- GET  /api/leaderboard
- GET  /api/admin/registrations
- GET  /api/admin/tickets
- POST /api/admin/reset
