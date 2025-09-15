# Ballin' with Ocie — Auto Shooters + Admin Save
- Players who select "Shooting Contest" on registration are auto-added to Admin > Shooting Contest.
- Admin rows have a **Save** button to persist score/time (leaderboard updates).
- Teams are created via **Auto-Assign Teams** (from team-registered players).
- Tickets total shown on Tickets & Admin; **Remove Test Data** button resets everything.

## All-in-one (Docker / Render)
docker compose up --build
# open http://localhost:4000

## Split deploy (Vercel + Render)
- Backend (Render Docker) with this repo.
- Frontend (Vercel) from /frontend and set env VITE_API_BASE=https://YOUR-RENDER-URL
