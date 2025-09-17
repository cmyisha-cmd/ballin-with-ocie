# Multi-stage build for Render
FROM node:18-alpine AS build-frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/vite.config.js frontend/index.html ./
COPY frontend/src ./src
RUN npm install
RUN npm run build

FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY server/package.json ./server/package.json
RUN cd server && npm install --only=production
COPY server ./server
COPY --from=build-frontend /app/frontend/dist ./frontend/dist
EXPOSE 4000
CMD ["node","server/index.js"]
