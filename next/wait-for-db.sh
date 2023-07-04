#!/usr/bin/env sh

host="$1"
port="$2"

until echo "SELECT 1;" | nc "$host" "$port" > /dev/null 2>&1; do
  >&2 echo "Database is unavailable - Sleeping..."
  sleep 2
done

>&2 echo "Database is available! Continuing..."
