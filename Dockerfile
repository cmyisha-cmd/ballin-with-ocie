# Use Node 18 as the base
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the server code
COPY . .

# Expose port 3001 (Render sets $PORT internally)
EXPOSE 3001

# Start the server
CMD ["npm", "start"]
