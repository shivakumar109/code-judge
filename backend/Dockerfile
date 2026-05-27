FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package descriptors first to leverage Docker layer caching
COPY package*.json ./

# Install dependencies (use npm ci for reliable builds if package-lock.json exists, otherwise npm install)
RUN npm install

# Copy application source code
COPY . .

# Expose backend PORT
EXPOSE 5000

# Start server
CMD ["node", "server.js"]
