# ══════════════════════════════════════════════════════
# STAGE 1: BUILD - Compilar React + Vite
# ══════════════════════════════════════════════════════
FROM node:20-alpine AS build

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL
ARG COOLIFY_URL
ARG COOLIFY_FQDN

ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

RUN ls -la /app/dist && \
    test -f /app/dist/index.html || (echo "❌ Build failed" && exit 1)

# ══════════════════════════════════════════════════════
# STAGE 2: PRODUCTION - Nginx
# ══════════════════════════════════════════════════════
FROM nginx:alpine AS production

RUN apk add --no-cache wget

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chmod -R 755 /usr/share/nginx/html

USER nginx

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
