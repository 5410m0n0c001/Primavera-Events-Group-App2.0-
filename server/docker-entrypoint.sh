#!/bin/sh
set -e

echo "================================================"
echo "🚀 Primavera Events - Backend Initialization"
echo "================================================"

# FORCING SCHEMA SYNC: bypassing migration mismatch since we deleted the local migration folder
echo "🔄 Running migrations (db push)..."
npx prisma db push --accept-data-loss

echo "🌱 Seeding database (Synchronous)..."
# Ejecutando semillas bloqueando el arranque para asegurar que existan los datos
node prisma/seed-inventory.js
node prisma/seed-production.js
echo "✅ Seeding finished."

echo "🔄 Ensuring Prisma Client..."
npx prisma generate --schema=./prisma/schema.prisma

echo "✅ Ready to start!"
echo "================================================"

# Iniciar aplicación
exec node dist/index.js
