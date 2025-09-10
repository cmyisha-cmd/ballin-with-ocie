# Ballin' with Ocie: 13th Edition — Full Project

This repo contains both the **server (Node/Express)** and **frontend (React/Vite)** apps for the basketball tournament site.

## Structure
- `/server` — Express backend API + sample data (`data.json` preloaded)
- `/frontend` — React app (Vite) with NBA-style UI

## Setup (local)
### Backend
```bash
cd server
npm install
cp .env.example .env
# edit .env (set ADMIN_JWT_SECRET)
npm run dev
```
API will run on `http://localhost:4000`.

### Frontend
```bash
cd frontend
npm install
echo "VITE_API_BASE=http://localhost:4000" > .env
npm run dev
```
Frontend will run on `http://localhost:5173`.

## Deployment
### Backend
- **Render**: Create new Web Service, connect repo `/server`, set env vars, deploy.
- **Heroku**: Push `/server` folder, includes `Procfile`. Set config vars, deploy.

### Frontend
- **Vercel**: Connect repo `/frontend`, set build command `vite build`, output `dist/`, set `VITE_API_BASE` env var to backend URL.

## Features
- Player Registration (Shooting + Team)
- Shooting Leaderboard (auto-refresh every 5s, NBA style)
- Team Assignment (Admin)
- Tickets Request + Spectator List (Admin view)
- Birthday Messages Board (with replies)
- Admin Login (JWT protected)

Sample data is included in `server/data.json` so the site has content right away.
