# Ballin' with Ocie — Full Clean Repo

NBA-style tournament site with full-stack setup (React + Express) and Docker.

## Local (with Docker)
```bash
docker compose up --build
```
- Frontend: http://localhost:5173
- Backend:  http://localhost:4000

## Deploy
- Backend to Render (root: `server`, build: `npm install`, start: `npm start`)
- Frontend to Vercel (root: `frontend`, build: `npm run build`, output: `dist`)
- Set `VITE_API_BASE` in Vercel to your Render URL (no trailing slash).

## Notes
- Admin login: user `admin`, pass `ocie13`
- Auto-assign teams: Admin → "Auto Assign Teams"
- Leaderboard auto-refreshes every 5s on the homepage.
