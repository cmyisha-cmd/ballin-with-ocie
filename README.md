# Ballin' with Ocie — Classic Working Build
- NBA-like purple/black theme, classic layout.
- Pages: Home, Register, Tickets, Leaderboard, Birthday Wall, Admin.
- Admin: score edit (score/time), registrations, tickets, team auto-assign.
- Backend: Express + JSON file persistence.

## Run (Docker)
docker compose up --build
# http://localhost:4000

## Deploy
- Render (Docker) URL serves frontend + API together
- Or split: Vercel(frontend) + Render(backend) and set VITE_API_BASE
