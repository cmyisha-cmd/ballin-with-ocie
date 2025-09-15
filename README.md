# Ballin' with Ocie — Full Stack

## Quick Start (Docker)
```bash
docker compose up --build
# open http://localhost:4000  (server serves built frontend)
```

## Run Locally (separate)
Frontend:
```bash
cd frontend
npm i
npm run dev
```
Backend:
```bash
cd server
npm i
npm start
```

## Deploy
- **Vercel (Frontend):** `vercel.json` included; points to `frontend/dist`
- **Render (Backend):** create a Web Service from this repo root.
  - Start command: `node server/index.js`
  - Port: `4000`

## Admin Login
- Go to `/admin`
- Password: `admin123`
