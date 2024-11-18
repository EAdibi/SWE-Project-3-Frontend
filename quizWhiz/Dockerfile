# Build stage
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the web version
RUN npx expo export --platform web

# Create a simple Express server file
RUN echo "const express = require('express'); \
const path = require('path'); \
const app = express(); \
const PORT = process.env.PORT || 8080; \
app.use(express.static(path.join(__dirname, 'dist'))); \
app.get('*', (req, res) => { \
  res.sendFile(path.join(__dirname, 'dist', 'index.html')); \
}); \
app.listen(PORT, () => { \
  console.log('Server is running on port', PORT); \
});" > server.js

# Install Express
RUN npm install express

# Start the server
CMD ["node", "server.js"]

# Expose the port
EXPOSE 8080