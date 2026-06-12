FROM node:22-alpine

# Instalar pnpm de forma global en el contenedor
RUN npm install -g pnpm

WORKDIR /app

# Copiar solo el package.json y el .npmrc
COPY package.json .npmrc ./

# Configurar pnpm para que guarde las dependencias de forma plana dentro del contenedor
RUN pnpm config set virtual-store-dir .pnpm

# 🚀 Habilitar los scripts de compilación nativos para sharp y unrs-resolver de forma plana
RUN pnpm config set allowed-builds sharp,unrs-resolver

# Instalar dependencias sin el bloqueo estricto de lockfile
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