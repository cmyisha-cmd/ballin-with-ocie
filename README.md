# Ballin' with Ocie — Final (MM:SS + Admin Data)
- Auto-add shooters from registrations.
- Admin saves score + minutes/seconds (leaderboard updates by score desc, time asc).
- Teams auto-assign; Tickets total; Clear Test Data.

## Render (single Docker service)
- Connect repo and deploy. Open primary URL.

## Vercel (frontend) + Render (backend)
- Deploy server (Docker) to Render.
- Deploy /frontend to Vercel and set env: VITE_API_BASE=https://YOUR-RENDER-URL
