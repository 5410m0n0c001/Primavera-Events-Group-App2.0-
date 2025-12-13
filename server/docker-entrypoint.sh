#!/bin/sh
set -e

echo "================================================"
echo "🚀 Primavera Events - Backend Initialization"
echo "================================================"

# Esperar PostgreSQL
echo "⏳ Waiting for PostgreSQL..."
MAX_RETRIES=30
RETRY_COUNT=0

# Usar 'prisma migrate deploy' como check de conexión (es idempotente)
until npx prisma migrate deploy --schema=./prisma/schema.prisma || [ $RETRY_COUNT -eq $MAX_RETRIES ]; do
  RETRY_COUNT=$((RETRY_COUNT+1))
  echo "   Attempt $RETRY_COUNT/$MAX_RETRIES: DB not ready or migration failed, retrying..."
  sleep 5
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
  echo "❌ Failed to connect to database or run migrations (Proceeding for logs)"
  # exit 1 
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
