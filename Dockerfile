# --- Build frontend ---
FROM node:18-alpine AS build-frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/vite.config.js frontend/index.html frontend/src ./
RUN npm install
RUN npm run build

# --- Final server ---
FROM node:18-alpine
WORKDIR /app
COPY server ./server
COPY --from=build-frontend /app/frontend/dist ./frontend/dist
WORKDIR /app/server
RUN npm install
ENV PORT=4000
EXPOSE 4000
CMD ["node","index.js"]
