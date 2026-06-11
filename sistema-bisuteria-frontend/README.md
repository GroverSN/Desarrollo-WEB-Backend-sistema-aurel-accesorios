# Aurel Accesorios — Frontend (Admin)

Panel de administración para el emprendimiento **Aurel Accesorios**. Gestión de productos, ventas, reportes, consultas de clientes y más.

Construido con **Vue 3 + TypeScript + Pinia + Vite**.

## Stack

| Tecnología | Versión |
|---|---|
| Vue 3 | ^3.5.32 |
| TypeScript | ~6.0.2 |
| Vite | ^8.0.4 |
| vue-router | ^5.0.4 |
| Pinia | ^3.0.4 |
| Axios | ^1.15.0 |
| ApexCharts | ^5.10.6 |
| SweetAlert2 | ^11.26.24 |
| Lucide Vue Next | ^1.0.0 |

## Instalación

```bash
pnpm install
pnpm dev       # Desarrollo en http://localhost:5174
pnpm build     # Build producción
pnpm preview   # Vista previa del build
```

## Variables de entorno

Crear archivo `.env` en la raíz:

```env
VITE_API_URL=http://localhost:3000
```

## Rutas

| Ruta | Vista | Auth |
|---|---|---|
| `/` | Login | No |
| `/dashboard` | Dashboard | Sí |
| `/productos` | Productos | Sí |
| `/ventas` | Ventas | Sí |
| `/reportes` | Reportes | Sí |
| `/consultas` | Consultas | Sí |

## Módulos

### Productos
- CRUD completo con imágenes
- Gestión de categorías
- Filtros por nombre y categoría
- Subida de imágenes con preview

### Ventas
- Selección de productos con búsqueda y filtro por categoría
- Carrito con resumen, descuento opcional
- Métodos de pago: efectivo, QR, transferencia, tarjeta
- Validación de stock en tiempo real

### Reportes
- Dashboard con cards resumen (ingresos, ventas del mes, stock bajo)
- Gráfico mensual con ApexCharts (selector de año)
- Top productos más vendidos
- Descarga de reporte PDF

### Consultas (nuevo)
- Tabla con todas las consultas recibidas desde la web pública
- Filtros por nombre, fecha y estado
- Modal de detalle con datos del cliente y productos solicitados
- Cambio de estado (pendiente → contactado → cerrado)
- Eliminación con confirmación SweetAlert2
- Icono `MessageSquare` en el sidebar

## Autenticación

- JWT con refresh automático
- Token y usuario persistidos en localStorage
- Axios interceptor agrega `Authorization: Bearer <token>`
- 401 → logout automático y redirección a login
- Captcha en login/registro

## Estilos

- CSS plano con Custom Properties
- Paleta: oliva (#445a14), crema (#fcf9da), musgo (#84813e), tierra (#7e5a38)
- Modo oscuro con toggle (no persistente)
- Sin framework UI

## Cambios recientes

- **Nueva vista Consultas** con tabla, filtros, modales de detalle/cambio de estado
- **Nuevo servicio `consultas.ts`** para comunicarse con `GET/PUT/DELETE /consultas`
- **Sidebar actualizado** con enlace a Consultas y mensaje contador
- **Rediseño página Nosotros:** hero gradiente, misión/visión lado a lado, sección valores con iconos, CTA

## Deuda técnica

- API URL hardcodeada en `src/services/api.ts` — pendiente migrar a `.env`
- Modo oscuro no persistente
- Sin i18n (todo en español)
- Sin tests
