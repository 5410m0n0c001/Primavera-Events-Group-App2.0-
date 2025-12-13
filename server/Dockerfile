# ══════════════════════════════════════════════════════
# STAGE 1: DEPENDENCIES - Instalar TODO
# ══════════════════════════════════════════════════════
FROM node:20-alpine AS dependencies

WORKDIR /app
ENV NODE_ENV=development

# Instalar herramientas de build
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    openssl

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar TODAS las dependencias (incluyendo devDependencies para Prisma)
RUN npm ci

# Generar Prisma Client
RUN npx prisma generate

# ══════════════════════════════════════════════════════
# STAGE 2: BUILDER - Compilar aplicación (TypeScript)
# ══════════════════════════════════════════════════════
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/package*.json ./

# Copiar código fuente
COPY . .

# Compilar TypeScript
RUN npm run build

# ══════════════════════════════════════════════════════
# STAGE 3: PRODUCTION - Runtime optimizado
# ══════════════════════════════════════════════════════
FROM node:20-alpine AS production

WORKDIR /app

# Instalar herramientas de runtime
RUN apk add --no-cache \
    wget \
    openssl \
    dumb-init

# Copiar archivos necesarios desde builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
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
