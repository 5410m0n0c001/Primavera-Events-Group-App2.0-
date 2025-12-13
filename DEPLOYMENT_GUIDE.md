# 🚀 Guía de Despliegue en Coolify

Esta guía detalla los pasos para desplegar **Primavera Events Group** en tu servidor VPS usando Coolify.

## 📋 Requisitos Previos

1.  Tener acceso a tu instancia de Coolify.
2.  Tener este repositorio subido a GitHub (público o privado conectado).
3.  Tener un dominio configurado (opcional pero recomendado para SSL).

## 🛠️ Paso 1: Preparación del Proyecto

Asegúrate de que los siguientes archivos (generados automáticamente) estén en tu repositorio:
- `docker-compose.yml`
- `server/Dockerfile`
- `server/docker-entrypoint.sh`
- `client/Dockerfile`
- `client/nginx.conf`

Haz commit y push de estos cambios:
```bash
git add .
git commit -m "chore: add docker configuration for coolify"
git push origin main
```

## 🚀 Paso 2: Crear Servicio en Coolify

1.  En tu dashboard de Coolify, ve a tu Proyecto.
2.  Haz clic en **"+ New"**.
3.  Selecciona **"Git Repository"** (o "Public Repository" si es público).
4.  Selecciona tu repositorio: `Primavera-Events-Group-App2.0-`.
5.  Branch: `main`.
6.  **Build Pack**: Selecciona **"Docker Compose"**.
7.  Coolify debería detectar automáticamente el archivo `docker-compose.yml` en la raíz.

## ⚙️ Paso 3: Configuración de Variables de Entorno

En la pestaña "Configuration" > "Environment Variables" de tu servicio en Coolify, agrega las siguientes:

| Clave | Valor Recomendado | Descripción |
| :--- | :--- | :--- |
| `POSTGRES_USER` | `primavera` | Usuario de base de datos |
| `POSTGRES_PASSWORD` | `(genera una contraseña segura)` | Contraseña de base de datos |
| `POSTGRES_DB` | `primavera_events` | Nombre de base de datos |
| `JWT_SECRET` | `(genera un string largo random)` | Secreto para tokens JWT |
| `CORS_ORIGIN` | `https://tu-dominio-frontend.com` | URL pública de tu frontend |
| `VITE_API_URL` | `https://tu-dominio-backend.com` | URL pública de tu backend |

> **Nota**: `DATABASE_URL` se construye automáticamente en `docker-compose.yml` usando las variables `POSTGRES_*`. No necesitas definirla manualmente a menos que uses una DB externa.

## 🌐 Paso 4: Dominios

En la configuración del servicio en Coolify:

1.  **Frontend**: Asigna un dominio (ej. `app.primaveraevents.com`).
    *   Puerto interno de Coolify mapeado a: `80` (contenedor frontend).
2.  **Backend**: Asigna un dominio (ej. `api.primaveraevents.com`).
    *   Puerto interno de Coolify mapeado a: `3000` (contenedor backend).

## 🚀 Paso 5: Deploy

1.  Haz clic en **"Deploy"**.
2.  Observa los logs de construcción.
    *   El backend instalará dependencias y generará Prisma Client.
    *   El frontend compilará con Vite.
3.  El proceso puede tardar 2-5 minutos la primera vez.

## ✅ Verificación

1.  Visita `https://api.primaveraevents.com/health`. Deberías recibir `{"status": "healthy"}`.
2.  Visita `https://app.primaveraevents.com`. Deberías ver la aplicación cargando.

## 🔧 Troubleshooting Común

### Error: `npm ci` fails
Verifica que `package-lock.json` esté en el repo y sea consistente con `package.json`. La configuración Docker actual usa un multi-stage build robusto para evitar problemas con Prisma.

### Error: Database Connection
Si el backend falla al iniciar, revisa los logs. El script `docker-entrypoint.sh` espera a la DB, pero si las credenciales no coinciden, fallará tras 30 intentos.

### Error: CORS
Si el frontend no puede hablar con el backend, asegura que `CORS_ORIGIN` en el backend coincida exactamente con la URL del frontend.
