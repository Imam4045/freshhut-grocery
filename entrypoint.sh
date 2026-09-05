#!/bin/bash
set -e

# Render injects a PORT env var at runtime; default to 10000 locally
PORT="${PORT:-10000}"

# Update Apache to listen on the correct port
sed -i "s/Listen 80/Listen ${PORT}/" /etc/apache2/ports.conf
sed -i "s/:80/:${PORT}/" /etc/apache2/sites-available/000-default.conf

exec apache2-foreground
