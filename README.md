# Primavera Events Group

> **Sistema Digital Integral de Gestión de Eventos y Cotizaciones**  
> **Versión:** 2.2.0  
> **Estado:** Producción (Desplegado vía Coolify con base de datos PostgreSQL)  
> **Última actualización:** Marzo 2026

---

## 📌 Visión General del Proyecto

**Primavera Events Group** es un sistema integral de **Event Management & Quotation System** diseñado para centralizar, estandarizar y automatizar el proceso de generación de propuestas, ventas y operación para eventos sociales y corporativos; compitiendo con los líderes del mercado en las zonas de Morelos y CDMX.

El sistema cuenta con un **Dashboard Digital Integral** que elimina el uso de hojas de cálculo dispersas, reduce errores humanos en cálculos financieros y permite generar de manera consistente cotizaciones profesionales en PDF, un análisis financiero automatizado, y documentos operativos para producción (Layouts, itinerarios).

### 🎯 Usuarios Objetivo

- Directores y Líderes del Proyecto
- Vendedores / Ejecutivo de Cuentas
- Coordinadores de eventos y Productores
- Administradores

### 🧩 Problemas que Resuelve

- Falta de control sobre precios, inventarios de extras, y versiones de cotizaciones.
- Errores manuales en cálculos de IVA, y costos totales por invitado.
- Procesos lentos y poco profesionales para generar e interactuar con propuestas.
- Dificultades logísticas resueltas mediante layouts de producción y flujos paso a paso para la operación el día del evento.
- Ausencia de demostraciones de la propuesta de valor y rentabilidad antes de la contratación.

---

## 🧰 Stack Tecnológico

El proyecto es un **Monorepo** estructurado bajo una arquitectura cliente-servidor, preparado para despliegue automatizado.

### Frontend
- **Core:** React + TypeScript + Vite
- **Estilos:** Tailwind CSS
- **Generación de Reportes / PDF:** `html2canvas`, `jspdf`, `xlsx`
- **Interacción Nativa:** Web Share API (`navigator.share`) para compartir cotizaciones desde cualquier dispositivo.

### Backend
- **Core:** Node.js + Express
- **ORM:** Prisma
- **Autenticación y Seguridad:** JWT, `bcryptjs`, Helmet, Express Rate Limit
- **Generación de PDF Oficial:** `pdfkit`

### Base de Datos e Infraestructura
- **Producción:** PostgreSQL (Orquestado por Coolify)
- **Desarrollo:** SQLite
- **Despliegue:** CI/CD Docker containers para cliente y servidor administrados de forma centralizada.

---

## 🏗️ Arquitectura y Principio Clave

📐 Diagrama técnico de alto nivel:  
👉 [`docs/architecture.md`](docs/architecture.md) & [`TECHNICAL_DOCS.md`](TECHNICAL_DOCS.md)

**Principio de Responsabilidad:**  
- El **frontend calcula** para ofrecer una experiencia fluida e inmediata en tiempo real (UX de primer nivel).
- El **backend valida, recalcula y autoriza** siendo la única fuente de verdad (Evita hackeos en precios desde el frontend).

---

## 🧩 Ecosistema y Módulos Principales

### A. Dashboard Digital Integral

- Epicentro de información y enrutamiento a todos los componentes del sistema.
- Interfaz moderna para agrupar reportes corporativos, control de locaciones, y creación de proyectos.

### B. Gestión de Cotizaciones y Ventas (Core)

- Creación y edición de propuestas económicas y selección dinámica de servicios.
- **Calculadora en Tiempo Real (Sticky Sidebar):** Desglose total visible en todo momento calculado con cada interacción.
- Opción rápida para **Compartir (Share Button):** Integración nativa a sistemas iOS/Android para enviar la propuesta a través de WhatsApp, E-mail, etc.

### C. Módulo de Locaciones, Servicios Extra y Valor Financiero

- **Gestión de Capacidades:** Control estricto de aforos y requerimientos base para cada locación del catálogo.
- **Sitemap Extras:** Control estratégico del up-selling (Video, Fotografía, Iluminación, etc.) priorizando aquellos servicios de alto impacto en el ticket.
- **Análisis Comparativo:** Herramienta integral para demostrar a prospectos el costo beneficio del paquete integral frente a contrataciones independientes en el mercado.

### D. Producción, Logística y Reportes

- **Layout de Producción:** Configuración física de los espacios.
- **Itinerario Minuto a Minuto:** Cronograma logístico inmutable para la coordinación del gran día.
- Generación de PDF sin recortes (optimizando visualización de tablas largas en móviles).

---

## 🔁 Flujo Crítico Operativo

```text
Usuario (Ejecutivo / Cliente Interno)
  ↓
Ingreso al Dashboard Digital
  ↓
Configuración: Locación, Invitados, Fechas, Servicios, Extras
  ↓
Visualización Financiera en Tiempo Real (Cálculos de ROI e IVA)
  ↓
Validación y Persistencia (Backend vía ORM)
  ↓
Exportación Multicanal:
  ├─> Generar Link con Share API y compartir viá App Nativa (WhatsApp, Mail)
  └─> Imprimir Comprobantes PDF Logísticos / Excel Financieros
```
