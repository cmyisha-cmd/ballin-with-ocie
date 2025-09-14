FROM node:18 as build-frontend
WORKDIR /app
ARG VITE_API_BASE
ENV VITE_API_BASE=$VITE_API_BASE

COPY frontend/package.json ./frontend/
RUN cd frontend && npm install
COPY frontend ./frontend

RUN echo ">>> Building frontend with VITE_API_BASE=$VITE_API_BASE"
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
