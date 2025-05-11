#!/bin/sh

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "PostgreSQL is ready!"

# Install netcat if not present
apk add --no-cache netcat-openbsd

# Generate and apply migrations
echo "Generating initial migration..."
npx prisma migrate dev --name init

# Start the application
npm start