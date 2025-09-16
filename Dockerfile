# --- Build frontend ---
FROM node:18-alpine AS build-frontend
WORKDIR /app
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install
COPY frontend ./frontend
RUN cd frontend && npm run build

# --- Build backend ---
FROM node:18-alpine AS build-backend
WORKDIR /app
COPY server/package*.json ./server/
RUN cd server && npm install
COPY server ./server

# --- Final image: serve API + built frontend + websockets ---
FROM node:18-alpine
WORKDIR /app
COPY --from=build-frontend /app/frontend/dist ./frontend/dist
COPY --from=build-backend /app/server ./server
WORKDIR /app/server
EXPOSE 4000
CMD ["npm","start"]
