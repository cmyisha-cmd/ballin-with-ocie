# Ballin' with Ocie — Full Stack (Vite + Express)

## Run locally
```bash
# terminal 1
cd server
npm install
node index.js

# terminal 2
cd frontend
npm install
npm run dev
```

Set frontend env if API is on a different host:
```
VITE_API_BASE=http://localhost:4000
```

## Docker (Render)
- Create new Web Service from this repo. Render will build Dockerfile.
- App serves frontend and API on the same URL.

## Vercel + Render split
- Deploy Docker to Render → copy URL
- In Vercel Project (root), keep vercel.json and set routes with your Render URL.
- In Vercel Project settings, add env `VITE_API_BASE` to the Render URL.
