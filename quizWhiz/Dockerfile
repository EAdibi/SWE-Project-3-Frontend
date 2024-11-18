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

# Production stage
FROM nginx:alpine

# Copy the built files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Create nginx config template
RUN echo $'\
server { \n\
    listen       ${PORT}; \n\
    server_name  localhost; \n\
    location / { \n\
        root   /usr/share/nginx/html; \n\
        index  index.html index.htm; \n\
        try_files $uri $uri/ /index.html; \n\
    } \n\
    error_page   500 502 503 504  /50x.html; \n\
    location = /50x.html { \n\
        root   /usr/share/nginx/html; \n\
    } \n\
}' > /etc/nginx/conf.d/configfile.template

# Copy the shell script to replace PORT in nginx config
RUN echo $'\
#!/bin/sh \n\
envsubst < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf \n\
nginx -g "daemon off;"' > /docker-entrypoint.sh

RUN chmod +x /docker-entrypoint.sh

# Set PORT environment variable with a default value
ENV PORT=8080

EXPOSE ${PORT}

# Start nginx
ENTRYPOINT ["/docker-entrypoint.sh"]