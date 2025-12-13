\# Primavera Events Group



> \*\*Descripción Técnica del Proyecto\*\*  

> \*\*Versión:\*\* 1.1.0  

> \*\*Última actualización:\*\* Diciembre 2025



---



\## 1. Visión General del Proyecto



\*\*Primavera Events Group\*\* es un sistema integral de \*\*Gestión de Eventos y Cotizaciones (Event Management \& Quotation System)\*\* diseñado para optimizar el flujo de trabajo de ventas y coordinación de eventos sociales y corporativos.



El sistema centraliza catálogos de servicios, automatiza cálculos financieros complejos y genera cotizaciones profesionales estandarizadas, eliminando la dependencia de hojas de cálculo dispersas.



\### Usuarios Objetivo



\* Vendedores

\* Coordinadores de eventos

\* Administradores



\### Problema que Resuelve



\* Falta de control sobre precios y versiones de cotizaciones

\* Errores manuales en cálculos (IVA, costos por persona)

\* Procesos lentos y poco profesionales para generar propuestas



---



\## 2. Stack Tecnológico



\### Frontend



\* React + TypeScript

\* Vite

\* Tailwind CSS



\### Backend



\* Node.js

\* Express

\* Prisma ORM



\### Base de Datos



\* SQLite (desarrollo)

\* PostgreSQL (producción – planeado)



\### Otros



\* Generación de PDF (pdfkit / motor propio)

\* Control de versiones: Git + GitHub



---



\## 3. Módulos Principales



\### A. Gestión de Cotizaciones (Core)



\* \*\*Propósito:\*\* Crear, editar y finalizar propuestas económicas.

\* \*\*Inputs:\*\* Servicios seleccionados, número de invitados, fecha del evento.

\* \*\*Outputs:\*\* Objeto `QuoteDraft` validado, totales calculados, PDF final.



\### B. Calculadora en Tiempo Real (Sticky Sidebar)



\* Panel siempre visible con totales actualizados

\* Animaciones de conteo

\* Desglose de impuestos y costo por persona



\### C. Gestión de Locaciones



\* Administración de espacios, capacidades y precios base

\* Validación de aforo vs invitados



\### D. Backend \& Validación



\* Fuente de verdad para reglas de negocio

\* Prevención de manipulación de precios desde el cliente



---



\## 4. Flujo Crítico de Cotización (Critical Path)



```text

Usuario

&nbsp; ↓

Wizard State (QuoteDraft)

&nbsp; ↓

Cálculo Derivado (useMemo)

&nbsp; ↓

QuoteBreakdown (UI Preview)

&nbsp; ↓

Backend Validation

&nbsp; ↓

Generación de PDF

```



1\. Inicialización del evento (nombre, invitados, fecha)

2\. Selección de servicios y locaciones

3\. Cálculo inmediato en frontend (preview)

4\. Sincronización visual en sidebar

5\. Validación final en backend y generación de PDF



---



\## 5. Estructura de Datos (Single Source of Truth)



\### QuoteDraft



```ts

interface QuoteDraft {

&nbsp; eventName: string;

&nbsp; guestCount: number;

&nbsp; date: string;

&nbsp; selectedItems: QuoteItem\[];

}

```



\### QuoteItem



```ts

interface QuoteItem {

&nbsp; id: string;

&nbsp; quantity: number;

&nbsp; unitPrice: number;

&nbsp; item: {

&nbsp;   id: string;

&nbsp;   name: string;

&nbsp;   price: number;

&nbsp;   category: string;

&nbsp; };

}

```



\### Totals



```ts

interface Totals {

&nbsp; subtotal: number;

&nbsp; tax: number;

&nbsp; total: number;

&nbsp; costPerPerson: number;

}

```



---



\## 6. Lógica de Cálculo



La lógica de cálculo es \*\*síncrona y derivada\*\* durante el render de React usando `useMemo`.



```ts

const rawSubtotal = selectedItems.reduce((acc, curr) => {

&nbsp; const price = Number(curr.unitPrice) || Number(curr.item?.price) || 0;

&nbsp; return acc + price \* curr.quantity;

}, 0);



const subtotal = Number(rawSubtotal.toFixed(2));

const tax = Number((subtotal \* 0.16).toFixed(2));

const total = Number((subtotal + tax).toFixed(2));

```



\* \*\*IVA:\*\* 16%

\* \*\*Disparadores:\*\* cambios en `selectedItems` o `guestCount`

\* \*\*Backend:\*\* recalcula totales antes de generar el PDF



---



\## 7. Problemas Conocidos y Debugging



\### Totales en $0.00



\* \*\*Causa:\*\* `unitPrice` indefinido o como string

\* \*\*Solución:\*\* fallback de precios implementado

\* \*\*Estado:\*\* ✅ Corregido en rama `main`



\### Sidebar no Sticky



\* Falta de `position: sticky`

\* Contenedor padre sin altura válida



```css

.sidebar {

&nbsp; position: sticky;

&nbsp; top: 24px;

&nbsp; max-height: calc(100vh - 40px);

&nbsp; overflow-y: auto;

}

```



\### Desincronización de Cantidades



\* Mutación directa del estado

\* Solución: uso de `setDraft(prev => ...)` con inmutabilidad



---



\## 8. Principios de Arquitectura



\* Single Source of Truth en `Wizard.tsx`

\* Componentes presentacionales sin lógica de negocio

\* Inmutabilidad estricta del estado

\* Montos como `number`, formateo solo en UI



---



\## 9. Backend \& Seguridad



\* Validación híbrida (frontend + backend)

\* El backend recalcula precios usando la base de datos

\* Evita manipulación de precios desde el cliente



---



\## 10. Próximas Mejoras



\* Persistencia de borradores

\* Versionado de cotizaciones

\* Paquetes dinámicos de servicios

\* Tests E2E con Playwright o Cypress



---



\## 11. Estado del Proyecto



🟢 \*\*Activo en desarrollo\*\*  

🔧 Enfoque actual: estabilidad de cálculos, UX y validación backend



