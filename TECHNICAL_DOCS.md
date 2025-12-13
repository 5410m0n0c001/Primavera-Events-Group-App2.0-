# Primavera Events Group - Descripción Técnica del Proyecto

> **Versión del Documento:** 1.0.0
> **Última Actualización:** Diciembre 2025
> **Enfoque:** Arquitectura, Debugging y Módulo de Cotización

## 1. Visión General del Proyecto

**Primavera Events Group** es un sistema integral de **Gestión de Eventos y Cotizaciones (Event Management & Quotation System)** diseñado para optimizar el flujo de trabajo de ventas y coordinación de eventos sociales y corporativos.

*   **Usuarios Objetivo:** Vendedores, Coordinadores de Eventos, Administradores.
*   **Problema que Resuelve:** Elimina el uso de hojas de cálculo dispersas, centraliza el catálogo de servicios, automatiza cálculos complejos (IVA, costos por persona) y genera cotizaciones profesionales PDF estandarizadas.

## 2. Módulos Principales

### A. Gestión de Cotizaciones (Core)
*   **Propósito:** Crear, editar y finalizar propuestas económicas para clientes.
*   **Inputs:** Selección de servicios, cantidad de invitados, fecha del evento.
*   **Outputs:** Objeto `QuoteDraft` validado, Totales calculados, PDF generado.
*   **Dependencias:** Catálogo de Servicios, Gestión de Locaciones.

### B. Calculadora en Tiempo Real (Sticky Sidebar)
*   **Propósito:** Proporcionar feedback financiero inmediato al usuario mientras navega.
*   **Características:** Panel "Sticky" (siempre visible), animaciones de conteo, desagregación de IVA.

### C. Gestión de Locaciones
*   **Propósito:** Administrar espacios disponibles, capacidades y costos de renta.
*   **Inputs:** Datos de la locación (nombre, capacidad máxima, precio base).

### D. Backend & Validación
*   **Propósito:** Fuente de verdad para precios y reglas de negocio.
*   **Endpoints Clave:** `/api/quotes/validate` (Hybrid Sync), `/api/quotes/generate-pdf`.

## 3. Flujo de Cotización (Critical Path)

1.  **Inicialización:** El usuario define el evento (Nombre, Invitados, Fecha).
2.  **Selección:**
    *   El usuario navega por categorías (Locaciones, Catering, Música).
    *   Al hacer clic en `Agregar`, el ítem entra al estado `draft.selectedItems`.
3.  **Cálculo (Frontend):**
    *   `Wizard.tsx` detecta el cambio en `selectedItems`.
    *   `useMemo` recorre el array y suma `(precio * cantidad)`.
    *   Se calculan derivados: IVA (16%), Total General, Costo por Persona.
4.  **Sincronización UI:**
    *   El objeto `totals` se pasa como prop al componente `QuoteBreakdown`.
    *   El componente `QuoteBreakdown` actualiza sus contadores visuales.
5.  **Finalización:**
    *   Al hacer clic en "Ver Resumen Final", se llama a `/api/quotes/validate`.
    *   El backend verifica que los precios no hayan sido manipulados.
    *   Se genera el PDF final.

## 4. Estructura de Datos (Alta Prioridad)

### Objeto `QuoteDraft` (Estado Principal)
```typescript
interface QuoteDraft {
    eventName: string;
    guestCount: number;
    date: string;
    selectedItems: QuoteItem[]; // Array central de ítems
}
```

### Objeto `QuoteItem` (Ítem Individual)
```typescript
interface QuoteItem {
    id: string;              // Identificador único de la instancia (ej. "qi_17001_loc_1")
    quantity: number;        // Cantidad seleccionada
    unitPrice: number;       // Precio unitario congelado al momento de selección
    item: {                  // Referencia al catálogo
        id: string;          // ID del servicio (ej. "loc_1")
        name: string;
        price: number;       // Precio de lista actual
        category: string;
    };
}
```

### Objeto `Totals` (Calculados)
```typescript
interface Totals {
    subtotal: number;       // Suma bruta
    tax: number;            // IVA (16%)
    total: number;          // Subtotal + IVA
    costPerPerson: number;  // Total / Invitados
}
```

## 5. Lógica de Cálculo

El cálculo es **síncrono y derivado** durante el ciclo de renderizado de React (usando `useMemo`).

**Fórmula Maestra (`Wizard.tsx`):**
```javascript
const rawSubtotal = selectedItems.reduce((acc, curr) => {
    // Prioridad: Precio Unitario explícito > Precio de Catálogo > 0
    const price = Number(curr.unitPrice) || Number(curr.item?.price) || 0;
    return acc + (price * curr.quantity);
}, 0);

const subtotal = Number(rawSubtotal.toFixed(2));
const tax = Number((subtotal * 0.16).toFixed(2));
const total = Number((subtotal + tax).toFixed(2));
```

*   **Disparadores:** Cualquier cambio en `draft.selectedItems` o `draft.guestCount`.
*   **Validación:** El frontend hace el cálculo para la UI ("Preview"), pero el Backend es la autoridad final para generar el PDF.

## 6. Problemas Conocidos / Puntos Críticos (Debugging Guide)

### 🔴 Totales en $0.00
*   **Síntoma:** Agregas ítems pero el total sigue en 0.
*   **Causa Común:** `unitPrice` viene como `undefined` y la lógica de suma es muy estricta (`curr.unitPrice !== undefined`).
*   **Solución:** Usar lógica de fallback: `Number(curr.unitPrice) || Number(curr.item.price) || 0`. (Corregido en v2.0).
*   **Dónde revisar:** `Wizard.tsx` -> `useMemo` hook.

### 🔴 Sidebar Desaparece al hacer Scroll
*   **Síntoma:** El resumen se pierde al bajar en la página.
*   **Causa:** Falta de `position: sticky` o altura mal definida.
*   **Solución Correcta:**
    ```css
    .sidebar {
        position: sticky;
        top: 24px; /* top-6 */
        max-height: calc(100vh - 40px);
        height: fit-content;
        overflow-y: auto; /* Scroll interno */
    }
    ```

### 🔴 Desincronización de Cantidades
*   **Síntoma:** Cambias la cantidad en la tarjeta del servicio pero el total no se mueve.
*   **Causa:** Mutación directa del estado o uso incorrecto de índices de array.
*   **Solución:** Siempre usar `setDraft(prev => ... map ...)` para crear un *nuevo* array con el ítem actualizado.

## 7. UX / UI Behavior

*   **Sticky Calculator:** Debe permanecer fija en la columna derecha.
*   **Feedback Visual:**
    *   Al agregar/eliminar: Animación suave en el número del Total.
    *   Exceso de capacidad: Alerta roja pulsante si `invitados > capacidad locación`.
*   **Layout:**
    *   **Desktop:** Sidebar lateral derecho.
    *   **Mobile:** (Pendiente) Debería colapsar a una barra inferior fija o botón flotante.

## 8. Backend / Integración

*   **Tecnología:** Node.js + Express + Prisma (SQLite/Postgres).
*   **Validación Híbrida:**
    1.  Frontend calcula para UX rápida.
    2.  Antes de finalizar, Frontend envía `item IDs` al Backend.
    3.  Backend recalcula usando precios de base de datos (evita hackeos de precio en cliente).
    4.  Backend devuelve `valid: true/false` y los totales oficiales.

## 9. Guía de Debugging Práctica

**Si el Total es Incorrecto:**
1.  Abre las **DevTools** del navegador.
2.  Busca el componente `Wizard` en React DevTools o pon un `console.log` dentro del `useMemo`.
3.  Verifica el array `draft.selectedItems`:
    *   ¿Tienen `unitPrice`?
    *   ¿Son números o strings? (ej. `"15000"` vs `15000`).
4.  Si `unitPrice` es `NaN`, revisa la función `handleToggleItem`.

**Si el Sidebar no es Sticky:**
1.  Inspecciona el elemento `div` del sidebar.
2.  Verifica que su contenedor padre tenga altura suficiente para permitir scroll.
3.  Verifica que ningún ancestro tenga `overflow: hidden`.

## 10. Convenciones y Buenas Prácticas

*   **Single Source of Truth:** `Wizard.tsx` mantiene el estado. `QuoteBreakdown.tsx` es solo presentacional (solo recibe props, no calcula).
*   **Inmutabilidad:** Nunca modificar `selectedItems.push()`. Usar `[...selectedItems, newItem]`.
*   **Moneda:** Siempre manejar montos como `number` en lógica y formatear solo al renderizar (`.toLocaleString('es-MX')`).

## 11. Próximas Mejoras Planeadas

*   [ ] **Persistencia:** Guardar borrador en `localStorage` o base de datos.
*   [ ] **Versiones:** Historial de cambios de la cotización.
*   [ ] **Paquetes Dinámicos:** Ítems que agregan automáticamente sub-ítems.
*   [ ] **Test E2E:** Cypress/Playwright tests para flujo crítico de cotización.
