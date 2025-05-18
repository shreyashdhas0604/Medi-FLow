FROM node:18-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies and development tools
RUN npm install && \
    npm install -g nodemon ts-node typescript

# Create prisma directory and copy schema
RUN mkdir -p prisma
COPY src/models/prisma/schema.prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy TypeScript config and source code
COPY tsconfig.json ./
COPY src/ ./src/

# Copy startup script
COPY startup.sh .
RUN chmod +x startup.sh

# Use ts-node-dev for better TypeScript support in development
# Replace the last line with this
CMD ["npx", "nodemon", "--watch", "src", "--ext", "ts,json", "--exec", "ts-node-dev", "--poll", "src/app.ts"]