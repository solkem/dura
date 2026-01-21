#!/bin/sh
# Docker entrypoint script
# Runs migrations, then starts the server

echo "[entrypoint] Starting Dura..."

# Run migrations
echo "[entrypoint] Running database migrations..."
node /app/scripts/migrate.js

# Check if migration succeeded
if [ $? -ne 0 ]; then
    echo "[entrypoint] WARNING: Migrations failed, but continuing with server start..."
fi

# Start the server
echo "[entrypoint] Starting server..."
exec node /app/dist/server/entry.mjs
