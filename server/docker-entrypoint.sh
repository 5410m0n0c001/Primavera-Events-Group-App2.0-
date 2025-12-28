#!/bin/sh
set -e

echo "================================================"
echo "🚀 Primavera Events - Backend Initialization"
echo "================================================"

# Fast fail-over to migrations - let Node.js handling checking connectivity if this fails
echo "🔄 Running migrations (db push)..."
npx prisma db push --schema=./prisma/schema.prisma --accept-data-loss

echo "🌱 Seeding database..."
node dist/seed.js || echo "⚠️  Seeding warning (non-fatal)"

echo "🔄 Ensuring Prisma Client..."
npx prisma generate --schema=./prisma/schema.prisma

echo "✅ Ready to start!"
echo "================================================"

# Iniciar aplicación
exec node dist/index.js
