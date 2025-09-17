# Ballin' with Ocie — Production
- Frontend: React + Vite + Tailwind
- Backend: Express + JSON storage (no sample data)
- Admin password: `ocie2025`

## Local dev
- Terminal 1: `cd server && npm install && npm start` (port 4000)
- Terminal 2: `cd frontend && npm install && npm run dev` (Vite dev on 5173)

## Single-container deploy (Render or Docker)
- Build with the included Dockerfile. Serves API at `/api` and static frontend.

## Vercel + Render
- Deploy server to Render at `https://ballin-with-ocie.onrender.com`
- Deploy `frontend/` to Vercel; `vercel.json` rewrites `/api/*` to Render.
