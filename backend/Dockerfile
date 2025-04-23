FROM node:18-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Create prisma directory and copy schema
RUN mkdir -p prisma
COPY src/models/prisma/schema.prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy TypeScript config and source code
COPY tsconfig.json ./
COPY src/ ./src/

# Build TypeScript
RUN npm run build

EXPOSE 5000

# Create a startup script
COPY startup.sh .
RUN chmod +x startup.sh

CMD ["./startup.sh"]