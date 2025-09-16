# --- Build frontend ---
FROM node:18-alpine as build-frontend
WORKDIR /app
COPY frontend/package.json frontend/vite.config.js frontend/tailwind.config.js frontend/postcss.config.cjs frontend/index.html ./
COPY frontend/src ./src
RUN npm install && npm run build

# --- Final server ---
FROM node:18-alpine
WORKDIR /app
COPY ballin-with-ocie/package.json ./ballin-with-ocie/package.json
RUN cd ballin-with-ocie && npm install
COPY ballin-with-ocie ./ballin-with-ocie
COPY --from=build-frontend /app/dist ./frontend/dist
WORKDIR /app/ballin-with-ocie
ENV PORT=10000
EXPOSE 10000
CMD ["npm","start"]
