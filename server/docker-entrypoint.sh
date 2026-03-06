#!/bin/sh
set -e

echo "================================================"
echo "🚀 Primavera Events - Backend Initialization"
echo "================================================"

echo "🔄 Running migrations (migrate deploy)..."
npx prisma migrate deploy

echo "🔄 Ensuring Prisma Client..."
npx prisma generate --schema=./prisma/schema.prisma

echo "🌱 Seeding database (in background)..."
# Las semillas se ejecutan en segundo plano (con &) para no bloquear el inicio del servidor
# y evitar que el Healthcheck de Docker aborte el contenedor por timeout.
node prisma/seed-inventory.js &
node prisma/seed-production.js &
echo "✅ Seeding started in background."

echo "✅ Ready to start!"
echo "================================================"

# Iniciar aplicación
exec node dist/index.js
