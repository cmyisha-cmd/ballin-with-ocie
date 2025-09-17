# -------- Build frontend --------
FROM node:18 AS build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend ./
RUN npm run build

# -------- Final image --------
FROM node:18
WORKDIR /app
COPY server ./server
RUN cd server && npm install
COPY --from=build-frontend /app/frontend/dist ./frontend/dist
ENV PORT=4000
EXPOSE 4000
CMD ["node","server/index.js"]
