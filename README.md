# Ballin' with Ocie — Clean Production (Frontend + Server)

- **No sample data**. All JSON starts empty.
- **Admin password**: `ocie2025` (header `x-admin-pass`)
- **Frontend**: Vite + React + Tailwind (postcss config fixed as CJS)
- **Server**: `ballin-with-ocie` (Express + JSON persistence)
- **Vercel**: `vercel.json` proxies `/api` to Render backend
- **Docker**: Multi-stage builds frontend and serves via server

## Local Dev
Frontend:
```bash
cd frontend
npm i
npm run dev
```
Server:
```bash
cd ballin-with-ocie
npm i
npm start
```

## Render (single service Docker)
- Root = repo root
- Docker deploy. App serves frontend + API at same domain.

## Vercel + Render split
- Render: deploy `ballin-with-ocie` as Node service
- Vercel: set env `VITE_API_BASE=https://<your-render-service>.onrender.com` or keep `vercel.json` proxy
