# ══════════════════════════════════════════════════════
# STAGE 1: DEPENDENCIES - Instalar TODO
# ══════════════════════════════════════════════════════
FROM node:20-alpine AS dependencies

WORKDIR /app

# Instalar herramientas de build
RUN apk add --no-cache python3 make g++ openssl

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

# Generar Prisma Client
RUN npx prisma generate


# ══════════════════════════════════════════════════════
# STAGE 2: BUILDER - Compilar aplicación (TypeScript)
# ══════════════════════════════════════════════════════
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar openssl para que Prisma pueda generar la migración
RUN apk add --no-cache openssl

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/package*.json ./

# Copiar código fuente
COPY . .

# Compilar TypeScript
RUN npm run build

# Create initial migration here so it is not overwritten by COPY . .
RUN mkdir -p prisma/migrations/0_init && \
    npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/0_init/migration.sql

# ══════════════════════════════════════════════════════
# STAGE 3: PRUNE - Filtrar DevDependencies
# ══════════════════════════════════════════════════════
FROM node:20-alpine AS pruner
WORKDIR /app
COPY --from=dependencies /app/package*.json ./
COPY --from=dependencies /app/node_modules ./node_modules
# Eliminar las dev dependencies para el stage final usando npm prune
RUN npm prune --omit=dev

# ══════════════════════════════════════════════════════
# STAGE 4: PRODUCTION - Runtime optimizado
# ══════════════════════════════════════════════════════
FROM node:20-alpine AS production

WORKDIR /app

# Instalar herramientas de runtime
RUN apk add --no-cache \
    wget \
    openssl \
    dumb-init

# Copiar archivos necesarios desde builder y pruner
COPY --from=builder /app/package*.json ./
COPY --from=pruner /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

# Copiar script de inicio
COPY --chown=nodejs:nodejs docker-entrypoint.sh ./
RUN chmod +x ./docker-entrypoint.sh

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=15s --start-period=120s --retries=5 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["./docker-entrypoint.sh"]
