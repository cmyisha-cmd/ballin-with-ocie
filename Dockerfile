# --- Build frontend ---
FROM node:18-alpine AS build-frontend
WORKDIR /app
COPY frontend/package.json frontend/vite.config.js frontend/tailwind.config.cjs frontend/postcss.config.cjs frontend/index.html ./
COPY frontend/src ./src
RUN npm install
RUN npm run build

# --- Final server ---
FROM node:18-alpine
WORKDIR /app
COPY server/package.json ./server/package.json
RUN cd server && npm install
COPY server ./server
COPY --from=build-frontend /app/dist ./frontend/dist
EXPOSE 4000
CMD ["node", "server/index.js"]
