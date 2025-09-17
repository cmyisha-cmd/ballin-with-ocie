# Multi-stage build
FROM node:18-alpine AS build-frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json frontend/vite.config.js frontend/tailwind.config.cjs frontend/postcss.config.cjs frontend/index.html ./
COPY frontend/src ./src
RUN npm ci && npm run build

FROM node:18-alpine
WORKDIR /app
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci
COPY server ./server
COPY --from=build-frontend /app/frontend/dist ./frontend/dist
ENV PORT=4000
EXPOSE 4000
CMD ["node","server/index.js"]
