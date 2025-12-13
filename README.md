# Primavera Events Group

> **Sistema de Gestión de Eventos y Cotizaciones**  
> **Versión:** 1.1.0  
> **Estado:** Activo en desarrollo  
> **Última actualización:** Diciembre 2025

---

## 📌 Visión General del Proyecto

**Primavera Events Group** es un sistema integral de **Event Management & Quotation System** diseñado para centralizar, estandarizar y automatizar el proceso de generación de cotizaciones para eventos sociales y corporativos.

El sistema elimina el uso de hojas de cálculo dispersas, reduce errores humanos en cálculos financieros y permite generar propuestas profesionales en formato PDF de manera consistente.

### 🎯 Usuarios Objetivo

- Vendedores
- Coordinadores de eventos
- Administradores

### 🧩 Problemas que Resuelve

- Falta de control sobre precios y versiones de cotizaciones
- Errores manuales en cálculos de IVA y totales
- Procesos lentos y poco profesionales para generar propuestas

---

## 🧰 Stack Tecnológico

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express
- Prisma ORM

### Base de Datos
- SQLite (desarrollo)
- PostgreSQL (producción – planeado)

### Otros
- Generación de PDF
- Git + GitHub para control de versiones

---

## 🏗️ Arquitectura

📐 Diagrama técnico de alto nivel:  
👉 [`docs/architecture.md`](docs/architecture.md)

**Principio clave:**  
- El **frontend calcula** para una experiencia fluida (UX)  
- El **backend valida y recalcula** como fuente de verdad (seguridad)

---

## 🧩 Módulos Principales

### A. Gestión de Cotizaciones (Core)

- Creación y edición de propuestas económicas
- Selección dinámica de servicios y locaciones
- Generación de cotizaciones finales en PDF

**Inputs:**  
- Servicios seleccionados  
- Número de invitados  
- Fecha del evento  

**Outputs:**  
- Totales calculados  
- Costo por persona  
- PDF profesional  

---

### B. Calculadora en Tiempo Real (Sticky Sidebar)

- Totales siempre visibles
- Actualización inmediata ante cambios
- Desglose de impuestos y costo por invitado

---

### C. Gestión de Locaciones

- Administración de espacios
- Control de capacidad y precios base
- Validación de aforo vs número de invitados

---

### D. Backend & Validación

- Reglas de negocio centralizadas
- Prevención de manipulación de precios desde el cliente
- Generación final de PDF

---

## 🔁 Flujo Crítico de Cotización

```text
Usuario
  ↓
Wizard State (QuoteDraft)
  ↓
Cálculo derivado (useMemo)
  ↓
QuoteBreakdown (Preview UI)
  ↓
Validación Backend
  ↓
Generación de PDF
