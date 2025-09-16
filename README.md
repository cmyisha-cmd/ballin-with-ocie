# Ballin' with Ocie — 13th Edition (Full Stack)

- Admin Password: **ocie2025**
- Single Render service recommended. This server serves both API and static frontend from `frontend/dist`.

## Local dev (two terminals)
1) Frontend
```
cd frontend
npm i
npm run dev
```

2) Server
```
cd server
npm i
npm start
```

## Render (single service)
- New Web Service → **Docker**
- Root: repo root (Dockerfile provided)
- Exposes port **4000**

## Vercel + Render (split)
- Deploy server to Render → note URL
- Set Vercel env `VITE_API_BASE` to your Render URL (no trailing slash)
- Replace `YOUR-RENDER-URL` in `vercel.json` before deploying to Vercel
