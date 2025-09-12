# Build and run full-stack app
FROM node:18 as build-frontend
WORKDIR /app
COPY frontend/package.json ./frontend/
RUN cd frontend && npm install
COPY frontend ./frontend
RUN cd frontend && npm run build

FROM node:18
WORKDIR /app
COPY server/package.json ./server/
RUN cd server && npm install
COPY server ./server
COPY --from=build-frontend /app/frontend/dist ./frontend/dist
WORKDIR /app/server
EXPOSE 4000
CMD ["npm","start"]
