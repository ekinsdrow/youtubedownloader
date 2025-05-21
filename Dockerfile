# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install ffmpeg
RUN apk add --no-cache ffmpeg

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
RUN npm install --save-dev ts-node @types/fluent-ffmpeg


# Copy source code
COPY . .

# Ensure tmp directory exists for downloads
RUN mkdir -p /app/tmp

# Set environment variables (override in production)
ENV NODE_ENV=production

# Expose no ports (Telegram bot is outbound only)

# Start the bot using ts-node
CMD ["npx", "ts-node", "src/bot.ts"]
