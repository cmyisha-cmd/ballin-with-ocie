FROM node:18-alpine AS build-frontend
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend ./
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=build-frontend /app/dist ./frontend/dist
COPY server ./server
RUN cd server && npm install
EXPOSE 4000
CMD ["node","server/index.js"]