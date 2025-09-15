# --- Stage 1: Build Frontend ---
FROM node:18-alpine AS build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
RUN npm run build

# --- Stage 2: Final Container ---
FROM node:18-alpine
WORKDIR /app
COPY server/package*.json ./server/
RUN cd server && npm install
COPY server ./server
COPY --from=build-frontend /app/frontend/dist ./frontend/dist

EXPOSE 4000
CMD ["node","server/index.js"]
