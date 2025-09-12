# Step 1: Build frontend
FROM node:18 as build-frontend
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json* ./frontend/
RUN cd frontend && npm install
COPY frontend ./frontend
RUN cd frontend && npm run build

# Step 2: Backend + built frontend
FROM node:18
WORKDIR /app
COPY server/package.json server/package-lock.json* ./server/
RUN cd server && npm install
COPY server ./server
COPY --from=build-frontend /app/frontend/dist ./frontend/dist
WORKDIR /app/server
EXPOSE 4000
CMD ["npm","start"]
