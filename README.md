# Ballin' with Ocie — Clean Production (Full Project)

No sample data. Same layout & styling. Fully wired to API.

## Local
npm install --prefix frontend
npm run build --prefix frontend
npm install --prefix server
node server/index.js

## Docker
docker compose up --build
# open http://localhost:4000

## Deploy
- Render (one service, Dockerfile): connect repo, deploy.
- Vercel (frontend) + Render (server): set VITE_API_BASE on Vercel to your Render URL.
