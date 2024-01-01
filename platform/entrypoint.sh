#!/usr/bin/env sh

host=agentgpt_db
port=3306

until echo "SELECT 1;" | nc "$host" "$port" > /dev/null 2>&1; do
  >&2 echo "Database is unavailable - Sleeping..."
  sleep 2
done

>&2 echo "Database is available! Continuing..."

# Run cmd
exec "$@"
