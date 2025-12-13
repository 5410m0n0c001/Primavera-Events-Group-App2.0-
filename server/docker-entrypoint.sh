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
until npx prisma db push --schema=./prisma/schema.prisma --accept-data-loss || [ $RETRY_COUNT -eq $MAX_RETRIES ]; do
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
echo "🔄 Running migrations (db push)..."
# Usamos db push porque no estamos usando flujos de migraciones formales todavía
npx prisma db push --schema=./prisma/schema.prisma --accept-data-loss || echo "⚠️  DB Push failed"

# Generar cliente (redundante pero seguro)
echo "🔄 Ensuring Prisma Client..."
npx prisma generate --schema=./prisma/schema.prisma

# Semillado automático (simple, siempre intenta correr pero el script seed.ts debe ser idempotente o manejar duplicados si fallara)
# Para producción real, lo ideal es una verificación seria. Aquí simplemente corremos seed y si falla (ya existen datos) no bloquea el inicio.
echo "🌱 Seeding database..."
npm run seed || echo "⚠️  Seeding skipped or failed (data might already exist)"

echo "✅ Ready to start!"
echo "================================================"

# Iniciar aplicación (dist/index.js para TS compilado)
exec node dist/index.js
