# Aurel Accesorios — Web Pública

Sitio web público del emprendimiento **Aurel Accesorios**, dedicado a la venta de accesorios de bisutería artesanales (aros, pulseras, anillos, collares, etc.).

Construido con **Vue 3 + TypeScript + Pinia + Vite**.

## Stack

| Tecnología | Versión |
|---|---|
| Vue 3 | ^3.5.32 |
| TypeScript | ~6.0.2 |
| Pinia | ^3.0.4 |
| Vue Router | ^4.6.4 |
| Axios | ^1.15.0 |
| Lucide Vue Next | ^1.0.0 |
| Vite | ^8.0.4 |

## Instalación

```bash
pnpm install
pnpm dev       # Desarrollo en http://localhost:5173
pnpm build     # Build producción
pnpm preview   # Vista previa del build
```

## Variables de entorno (`.env`)

```env
VITE_API_URL=http://localhost:3000
VITE_WHATSAPP_NUMBER=+59169577432
```

## Funcionalidades

### Catálogo de productos
- Navegación por categorías
- Buscador por nombre o código
- Skeleton loaders mientras carga

### Detalle de producto
- Vista individual con selector de cantidad
- Botón "Agregar al carrito" (deshabilitado si stock = 0, muestra badge "Agotado")
- Carga de datos desde la API

### Carrito de compras
- Store Pinia con persistencia en localStorage
- Lista de productos con cantidades (+/−)
- Subtotales por producto y total general
- Formulario de nombre y teléfono
- **Envío a WhatsApp:** genera mensaje formateado con todos los items y abre WhatsApp
- **Guardado en backend:** el pedido se envía a `POST /consultas` para seguimiento desde el admin

### Otras páginas
- **Home** — Hero, productos destacados, categorías
- **Nosotros** — Historia, misión/visión, valores con iconos, CTA
- **Contacto** — Formulario de consultas (guardado vía `POST /consultas`)

### Diseño
- Responsivo (desktop, tablet, mobile)
- Transiciones fade entre rutas
- Componente Toast para notificaciones
- Botón WhatsApp flotante en todas las páginas
- Navbar con badge contador de items en el carrito
- Footer con enlace al carrito

## Rutas

| Ruta | Vista | Descripción |
|---|---|---|
| `/` | Home | Página principal |
| `/catalogo` | Catalogo | Catálogo con filtros y búsqueda |
| `/producto/:id` | ProductoDetalle | Detalle de producto |
| `/carrito` | Carrito | Carrito de compras + envío WhatsApp |
| `/nosotros` | Nosotros | Información del emprendimiento |
| `/contacto` | Contacto | Formulario de contacto |

## Estructura

```
src/
├── main.ts
├── App.vue
├── style.css
├── router/index.ts
├── stores/carrito.ts
├── composables/useToast.ts
├── services/
│   ├── api.ts
│   ├── productos.ts
│   ├── categorias.ts
│   └── consultas.ts
├── components/
│   ├── Navbar.vue
│   ├── HeroSection.vue
│   ├── ProductCard.vue
│   ├── Toast.vue
│   ├── Footer.vue
│   └── WhatsAppFloat.vue
└── views/
    ├── Home.vue
    ├── Catalogo.vue
    ├── ProductoDetalle.vue
    ├── Carrito.vue
    ├── Nosotros.vue
    └── Contacto.vue
```

## Cambios recientes

### Carrito + WhatsApp
- Store Pinia `carrito.ts` con persistencia en localStorage
- Vista `Carrito.vue` con lista editable, subtotales, formulario cliente
- Envío a WhatsApp con mensaje formateado (producto × cantidad = subtotal)
- Guardado automático en backend via `POST /consultas`
- Badge contador en Navbar
- Enlace "Carrito" en Footer

### Catálogo y productos
- ProductCard con botón "Agregar" y badge "Agotado" según stock
- ProductoDetalle con selector de cantidad
- Buscador por nombre/código en el catálogo
- Skeleton loaders mientras carga

### UX
- Componente Toast (composable `useToast`) para notificaciones
- Transiciones fade entre rutas
- `formatPrice` corregido para manejar precios string desde el backend

### Técnico
- Downgrade de vue-router@5 (comunitario) a vue-router@4.6.4 (oficial) por error `parentNode null`
- Eliminación de `<Transition>` problemático y `scrollBehavior` conflictivo

## API endpoints requeridos

| Endpoint | Uso |
|---|---|
| `GET /productos` | Catálogo |
| `GET /productos/:id` | Detalle producto |
| `GET /categorias?status=true` | Categorías activas |
| `POST /consultas` | Guardar pedidos/consultas |
