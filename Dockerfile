# Multi-stage build
FROM node:18-alpine as build-frontend
WORKDIR /app
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install
COPY frontend ./frontend
RUN cd frontend && npm run build

FROM node:18-alpine as build-backend
WORKDIR /app
COPY server/package*.json ./server/
RUN cd server && npm install
COPY server ./server

FROM node:18-alpine
WORKDIR /app
COPY --from=build-frontend /app/frontend/dist ./frontend/dist
COPY --from=build-backend /app/server ./server
WORKDIR /app/server
EXPOSE 4000
CMD ["npm","start"]
