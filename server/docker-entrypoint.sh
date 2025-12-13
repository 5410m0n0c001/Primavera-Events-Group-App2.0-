#!/bin/sh
set -e

echo "================================================"
echo "🚀 Primavera Events - Backend Initialization"
echo "================================================"

# Esperar PostgreSQL
echo "⏳ Waiting for PostgreSQL..."
MAX_RETRIES=30
RETRY_COUNT=0

until npx prisma db ping --schema=./prisma/schema.prisma 2>/dev/null || [ $RETRY_COUNT -eq $MAX_RETRIES ]; do
  RETRY_COUNT=$((RETRY_COUNT+1))
  echo "   Attempt $RETRY_COUNT/$MAX_RETRIES..."
  sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
  echo "❌ Failed to connect to database"
  exit 1
fi

echo "✅ Database connected!"

# Migraciones
echo "🔄 Running migrations..."
npx prisma migrate deploy --schema=./prisma/schema.prisma || echo "⚠️  Migrations failed"

# Generar cliente (redundante pero seguro)
echo "🔄 Ensuring Prisma Client..."
npx prisma generate --schema=./prisma/schema.prisma

echo "✅ Ready to start!"
echo "================================================"

# Iniciar aplicación (dist/index.js para TS compilado)
exec node dist/index.js
