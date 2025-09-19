FROM node:18

# Set working directory
WORKDIR /app

# Copy server package files
COPY server/package*.json ./server/

# Install dependencies
WORKDIR /app/server
RUN npm install --production

# Copy the rest of the server code
COPY server ./ 

# Expose port (Render injects PORT)
EXPOSE 3001

# Start the server
CMD ["npm", "start"]
