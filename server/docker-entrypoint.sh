#!/bin/sh
set -e

echo "================================================"
echo "🚀 Primavera Events - Backend Initialization"
echo "================================================"

# FORCING SCHEMA SYNC: bypassing migration mismatch since we deleted the local migration folder
echo "🔄 Running migrations (db push)..."
npx prisma db push --accept-data-loss

echo "🌱 Seeding database in background..."
# Run seeding in background to not block server startup
node dist/seed.js > logs/seed.log 2>&1 &
echo "⚠️  Seeding started in background. Check logs/seed.log for details."

echo "🔄 Ensuring Prisma Client..."
npx prisma generate --schema=./prisma/schema.prisma

echo "✅ Ready to start!"
echo "================================================"

# Iniciar aplicación
exec node dist/index.js
