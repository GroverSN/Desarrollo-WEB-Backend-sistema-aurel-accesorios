# Aurel Accesorios — Backend API

API REST construida con **NestJS 11 + TypeORM + PostgreSQL** para el emprendimiento **Aurel Accesorios**.

## Stack

| Tecnología | Versión | Propósito |
|---|---|---|
| **NestJS** | ^11.0.1 | Framework backend |
| **TypeORM** | ^0.3.28 | ORM para PostgreSQL |
| **PostgreSQL** | — | Base de datos |
| **JWT (passport)** | — | Autenticación |
| **bcryptjs** | ^3.0.3 | Hash de contraseñas |
| **sharp** | ^0.34.5 | Redimensionado de imágenes |
| **pdfkit** | ^0.18.0 | Generación de reportes PDF |
| **multer** | ^2.1.1 | Subida de archivos |
| **class-validator** | ^0.14.1 | Validación de DTOs |

## Requisitos

- Node.js >= 18
- pnpm
- PostgreSQL corriendo

## Instalación

```bash
pnpm install
```

## Variables de entorno (`.env`)

Copia `.env.example` a `.env` y ajusta los valores:

```env
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=tienda_db
JWT_SECRET=your_jwt_secret_key
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
```

## Scripts

| Comando | Descripción |
|---|---|
| `pnpm start` | Inicia en producción |
| `pnpm start:dev` | Modo desarrollo con watch |
| `pnpm start:prod` | `node dist/main` |
| `pnpm build` | Compila a `dist/` |
| `pnpm lint` | ESLint |

## Endpoints principales

### Autenticación
- `POST /auth/login` — Inicio de sesión (devuelve JWT + usuario)
- `POST /auth/register` — Registro de usuario

### Productos
- `GET /productos` — Listar productos (público)
- `GET /productos/:id` — Detalle de producto
- `POST /productos` — Crear producto (requiere JWT)
- `PUT /productos/:id` — Actualizar producto (requiere JWT)
- `DELETE /productos/:id` — Eliminar producto (requiere JWT)

### Categorías
- `GET /categorias` — Listar categorías
- `POST /categorias` — Crear (requiere JWT)
- `PUT /categorias/:id` — Actualizar (requiere JWT)
- `DELETE /categorias/:id` — Eliminar (requiere JWT)

### Ventas
- `GET /ventas` — Listar ventas (requiere JWT)
- `POST /ventas` — Registrar venta (requiere JWT)

### Consultas / Leads
- `POST /consultas` — Crear consulta (público, desde la web)
- `GET /consultas` — Listar consultas (requiere JWT)
- `GET /consultas/:id` — Detalle (requiere JWT)
- `PUT /consultas/:id` — Cambiar estado (requiere JWT)
- `DELETE /consultas/:id` — Eliminar (requiere JWT)

### Reportes
- `GET /reportes/dashboard` — Resumen para el Dashboard (requiere JWT)
- `GET /reportes/mensual?anio=2026` — Ventas por mes (requiere JWT)
- `GET /reportes/top-productos` — Top productos vendidos (requiere JWT)
- `GET /reportes/pdf` — Descargar reporte PDF (requiere JWT)

## Seguridad

- JWT con expiración de 24h
- Contraseñas hasheadas con bcryptjs
- CORS configurable via `CORS_ORIGINS`
- Las consultas GET requieren autenticación JWT
- Validación de DTOs con class-validator

## Cambios recientes (Fase 0 — Seguridad)

- **Variables de entorno:** DB credenciales, JWT secret, puerto y CORS movidos a `.env` via `@nestjs/config`
- **CORS dinámico:** acepta lista de orígenes separada por comas desde `CORS_ORIGINS`
- **GET /consultas protegido:** `findAll` y `findOne` ahora requieren JWT
- **JWT secret desde env:** el módulo JWT usa `registerAsync` con `ConfigService`

## Deuda técnica

- `synchronize: true` en TypeORM — útil en desarrollo, peligroso en producción (puede dropear tablas). Migrar a migraciones.
- Sin rate limiting en login — usar `@nestjs/throttler` para producción.
- Sin tests automatizados — Jest configurado pero sin tests escritos.

## Estructura

```
src/
├── main.ts
├── app.module.ts
├── app.controller.ts
├── app.service.ts
├── auth/
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── guards/jwt-auth.guard.ts
│   └── strategies/jwt.strategy.ts
├── categorias/
├── consultas/
├── productos/
├── reportes/
├── upload/
├── ventas/
└── entities/
```
