# Ballin' with Ocie — Realtime Birthday Wall (Replies + Emoji + WebSockets)
- Threaded replies and emoji reactions (👍 ❤️ 🎉 😂 🙌 👏 🔥 🥳) on messages and replies.
- Realtime updates via Socket.IO.
- Admin dashboard (registrations, shooting MM:SS, teams, tickets total).
- Docker all-in-one and Vercel-ready frontend.

## Render (single service)
- Connect repo, deploy. The Dockerfile serves both API and built frontend on port 4000.

## Vercel + Render
- Deploy server on Render (Docker).
- Deploy /frontend on Vercel and set VITE_API_BASE=https://YOUR-RENDER-URL

## Admin password
- Default: admin123 (change in frontend/src/pages/Admin.jsx)
