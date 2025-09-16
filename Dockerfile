# Multi-stage: build frontend, run server and serve built assets
FROM node:18-alpine AS build-frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/vite.config.js frontend/tailwind.config.js frontend/postcss.config.js frontend/index.html ./
COPY frontend/src ./src
RUN npm install && npm run build

FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY server ./server
RUN cd server && npm install --production
COPY --from=build-frontend /app/frontend/dist ./frontend/dist
EXPOSE 4000
CMD ["node", "server/index.js"]
