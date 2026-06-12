FROM node:22-alpine

# Instalar pnpm de forma global en el contenedor
RUN npm install -g pnpm

WORKDIR /app

# Copiar solo el package.json y el .npmrc
COPY package.json .npmrc ./

# 🚀 LA SOLUCIÓN DEFINITIVA: Pasar las configuraciones como variables de entorno nativas
ENV PNPM_CONFIG_VIRTUAL_STORE_DIR=.pnpm
ENV PNPM_CONFIG_ALLOWED_BUILDS=sharp,unrs-resolver

# Instalar dependencias directamente
RUN pnpm install --no-frozen-lockfile

# Ahora recién copiamos todo el resto del código del backend
COPY . .

# Construir el proyecto de NestJS (Genera la carpeta /dist)
RUN pnpm run build

# Eliminar dependencias de desarrollo para ahorrar espacio en Render
RUN pnpm prune --prod

EXPOSE 3000

# Ejecutar el comando de producción oficial
CMD ["node", "dist/main"]