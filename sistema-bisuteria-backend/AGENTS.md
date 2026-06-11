# AGENTS.md - Sistema Bisutería Backend

## Status: Backend COMPLETO ✅ | Frontend COMPLETO ✅ | Imágenes Locales COMPLETO ✅

El sistema está operativo. Fase completada: **Integración visual de imágenes locales**

---

## Startup Commands

```bash
# Backend
cd sistema-bisuteria-backend
pnpm install
pnpm run start:dev     # Puerto 3000

# Frontend (en otra terminal)
cd sistema-bisuteria-frontend
pnpm install
pnpm run dev           # Puerto 5173
```

---

## Estructura del Proyecto

```
sistema-bisuteria-backend/    → NestJS API (puerto 3000) ✅ COMPLETO
sistema-bisuteria-frontend/   → Panel Admin Vue.js (puerto 5173) ✅ COMPLETO
sistema-bisuteria-web/        → Website público Vue.js (POR CREAR)
```

---

## Base de Datos - Schema Completo

### Tablas y Columnas

| Tabla | Columnas |
|-------|----------|
| **usuarios** | id, nombre, email, password, rol (admin/usuario), status, createdAt, deletedAt |
| **productos** | id, codigo, nombre, descripcion, precio, stock, categoriaId, imagenId, status, createdAt, deletedAt |
| **categorias** | id, nombre, descripcion, status, createdAt, deletedAt |
| **imagenes** | id, url, public_id, createdAt, deletedAt |
| **ventas** | id, fecha, usuarioId, total, metodoPago (efectivo/qr/transferencia/tarjeta), clienteNombre, clienteTelefono, createdAt |
| **detalle_ventas** | id, ventaId, productoId, cantidad, precioUnitario, subtotal, createdAt |
| **logs_acceso** | id, usuarioId, ip, evento, browser, timestamp |
| **consultas** | id, nombre, telefono, productos, fecha, status (nueva/procesada/contactada), createdAt |

### Relaciones
- Productos → Categorías (many-to-one)
- Productos → Imágenes (many-to-one)
- Ventas → Usuarios (many-to-one)
- Ventas → DetalleVentas (one-to-many)
- DetalleVentas → Productos (many-to-one)

---

## Backend - Módulos Completos

### Endpoints Públicos (sin auth)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /productos | Catálogo público con filtros (?categoriaId=) |
| GET | /productos/:id | Detalle producto público |
| GET | /categorias | Lista categorías activas |
| POST | /consultas | Guardar consulta (lead WhatsApp) |

### Endpoints Protegidos (JWT)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| **Auth** |||
| POST | /auth/register | Registro con CAPTCHA |
| POST | /auth/login | Login JWT |
| GET | /auth/profile | Datos usuario actual |
| POST | /auth/logout | Logout (registra acceso) |
| **Categorías** |||
| GET | /categorias/admin/all | Todas las categorías |
| POST | /categorias | Crear categoría |
| PUT | /categorias/:id | Actualizar categoría |
| DELETE | /categorias/:id | Soft delete |
| **Productos** |||
| GET | /productos/admin/all | Todos los productos |
| POST | /productos | Crear producto |
| PUT | /productos/:id | Actualizar producto |
| DELETE | /productos/:id | Soft delete |
| **Ventas** |||
| POST | /ventas | Registrar venta (descuenta stock, requiere clienteNombre+clienteTelefono opcional) |
| GET | /ventas | Lista ventas |
| GET | /ventas/latest | Últimas 5 ventas con relaciones ligeras |
| **Reportes** |||
| GET | /reportes/pdf | PDF de ventas (?startDate=&endDate=&cliente=) |
| GET | /reportes/stats/monthly | Stats mensuales (?year=) |
| GET | /reportes/stats/top-products | Top 10 productos |
| GET | /reportes/stats/resumen | Resumen general |
| **Upload** |||
| POST | /upload | Subir imagen (FormData, solo JWT) |

---

## Frontend - Estado Actual

### Vistas Completas

1. **Login** (`/login`)
   - Login con JWT
   - Registro con CAPTCHA + validación password strength
   - Persistencia en localStorage

2. **Dashboard** (`/`)
   - Cards con iconos Lucide (DollarSign, ShoppingCart, Package, AlertTriangle)
   - Stock bajo siempre visible con alerta condicional
   - Últimas ventas (getLatestVentas(4)), top productos (getTopProducts(5))
   - Productos recientes con thumbnail
   - Botón "Nueva Venta" navega a /ventas
   - TransitionGroup en listas
   - Moneda: Bs

3. **Productos** (`/productos`)
   - Tabla con thumbnail, código, nombre, categoría, precio, stock
   - Filtros: búsqueda, categoría, stock
   - Modal crear/editar con:
     - Inputs: código, nombre, descripción, categoría, precio, stock
     - **Subida de archivo (FormData)** + campo URL alternativo
   - Modal ver detalle (botón Ojo) con imagen grande
   - Modal gestionar categorías

4. **Ventas** (`/ventas`)
   - Selector de productos con búsqueda y filtro por categoría
   - Carrito con footer sticky, badge contador, método de pago tipo chip con iconos Lucide
   - Campos Cliente: nombre (requerido) + teléfono (opcional)
   - TransitionGroup en listas, empty states
   - Registro automático de venta + descuento stock + SweetAlert2 confirmación
   - Moneda: Bs

5. **Reportes** (`/reportes`)
   - Gráfico ApexCharts mensual con gradient, selector de año ←/→
   - Top productos con barra de progreso
   - Cards resumen con iconos Lucide, ticket promedio
   - Últimas ventas con getLatestVentas(5)
   - Generador PDF con rango de fechas y filtro cliente opcional
   - TransitionGroup en listas
   - Moneda: Bs

---

## Imágenes Locales - Implementación (OPTIMIZADAS)

### Backend
- **Multer** con memoryStorage (procesa en RAM antes de guardar)
- **Sharp** para procesamiento de imágenes:
  - Redimensión: ancho máximo 1200px (mantiene proporción)
  - Conversión: salida en formato WebP
  - Calidad: 80%
  - Límite payload en main.ts: 50MB
- Carpeta `./uploads` (se crea automáticamente)
- Archivos estáticos servidos en `/uploads/*`
- Formatos de entrada: jpeg, jpg, png, gif, webp
- **Importante**: Todos los archivos se guardan con extensión `.webp`

### Frontend
- Input file con botón "Seleccionar archivo"
- Preview de imagen antes de subir
- Alternativa: pegar URL de imagen
- Envío via FormData al endpoint `/upload`

### Acceso
```
http://localhost:3000/uploads/filename.webp
```

---

## Pendientes

1. **Supabase**: Configurar para producción (actualmente local Postgres)
2. **Hosting**: Desplegar a producción (Vercel/Render/Railway)

---

## Últimos Cambios

### Moneda: $ → Bs (Bolivianos)
- `src/reportes/reportes.service.ts` — PDF ahora muestra `Bs` en vez de `$` en ingresos totales, total por venta y subtotales de productos

### Backend: Campo Cliente en Ventas
- `src/entities/venta.entity.ts` — Nuevas columnas: `cliente_nombre` (varchar, nullable) y `cliente_telefono` (varchar, nullable)
- `src/ventas/dtos/venta.dto.ts` — `CreateVentaDto` actualizado: `clienteNombre` (string, requerido), `clienteTelefono` (string, opcional)
- `src/ventas/ventas.service.ts` — Lógica de creación con cliente, método `findLatest()`
- `src/ventas/ventas.controller.ts` — Nuevo endpoint `GET /ventas/latest` (devuelve últimas 5 ventas con relaciones ligeras)

### Backend: Reportes con filtro Cliente
- `src/reportes/reportes.controller.ts` — PDF acepta query param `?cliente=` opcional
- `src/reportes/reportes.service.ts` — Filtro `ILike` por `clienteNombre`, muestra nombre y teléfono del cliente en PDF

### CORS (backend)
- `src/main.ts` — CORS cambiado de `origin: 'http://localhost:5173'` a `origin: true` (acepta cualquier origen en desarrollo)

### Frontend Admin
- `src/style.css` — `#app` corregido: eliminado `width: 1126px` y `margin: 0 auto` para que ocupe todo el ancho
- `src/App.vue` — Agregado `background: var(--bg-cream)` al `body`

### Frontend: Ventas.vue — Mejoras integrales
- Filtro por categoría en selector de productos
- Carrito con footer sticky, accent bar, hover, badge contador animado
- Método de pago como chips con iconos Lucide
- Campos Cliente (nombre + teléfono) con validación
- TransitionGroup en listas, empty states mejorados
- Moneda: Bs

### Frontend: Reportes.vue — Rediseño completo
- Gráfico ApexCharts con gradient y animaciones
- Selector de año con botones ←/→
- Barra de progreso en top products
- Cards con iconos Lucide
- Ticket Promedio, Últimas Ventas (getLatestVentas(5))
- Filtro Cliente en PDF
- TransitionGroup en listas
- Moneda: Bs

### Frontend: Dashboard.vue — Rediseño completo
- Cards con iconos Lucide sobre var(--surface)
- Stock Bajo siempre visible con alerta condicional
- Productos recientes con thumbnail y fallback
- Botón "Nueva Venta" que navega a /ventas
- Últimas ventas (getLatestVentas(4)) y Top productos (getTopProducts(5))
- TransitionGroup en listas
- Moneda: Bs

### Catálogo Web (`sistema-bisuteria-web/`) — CREADO ✅
- 5 vistas: Inicio, Catálogo, Detalle, Nosotros, Contacto
- Sin stock visible al público
- WhatsApp integrado (botón flotante + botón por producto)
- Formulario de contacto → `POST /consultas`
- Diseño responsive, misma paleta de colores

---

## Coding Style (Strict)

- Type arrays: `Tipo[]` NOT `Array<Tipo>`
- Arrow functions: `const fn = async () => {}`
- Always use async/await
- Use Interfaces over Types for objects
- Code in English; comments/logs in Spanish

---

## Docker (para producción)

```bash
docker compose up -d         # PostgreSQL
docker compose up --build    # Todo
```