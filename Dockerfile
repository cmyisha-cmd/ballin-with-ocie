
# --- Build frontend ---
FROM node:18-alpine AS build-frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/vite.config.js frontend/tailwind.config.js frontend/postcss.config.cjs frontend/index.html ./
COPY frontend/src ./src
RUN npm install && npm run build

# --- Final server ---
FROM node:18-alpine
WORKDIR /app
COPY server ./server
COPY --from=build-frontend /app/frontend/dist ./frontend/dist
WORKDIR /app/server
RUN npm install
EXPOSE 4000
CMD ["npm","start"]
