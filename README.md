# Ballin' with Ocie — Production
- Frontend: React + Vite + Tailwind
- Backend: Express (file persistence in /server/data)
- No sample data preloaded.
- Admin password: ocie2025 (Birthday Wall delete, Admin actions, Reset)

## Docker (single service)
docker build -t bwo .
docker run -p 4000:4000 bwo

## Local dev
# terminal A (server)
cd server && npm install && npm start
# terminal B (frontend)
cd frontend && npm install && npm run dev
