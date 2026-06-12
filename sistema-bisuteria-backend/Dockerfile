FROM node:22-alpine

# Instalar pnpm de forma global en el contenedor
RUN npm install -g pnpm

WORKDIR /app

# Copiar archivos de configuración de empaquetado primero (buena práctica para usar caché)
COPY package.json pnpm-lock.yaml .npmrc ./

# Configurar pnpm para que guarde las dependencias de forma plana dentro del contenedor
# Esto evita que los enlaces simbólicos se rompan en los servidores de Render
RUN pnpm config set virtual-store-dir .pnpm
RUN pnpm install --frozen-lockfile

# Copiar todo el resto del código del backend
COPY . .

# Construir el proyecto de NestJS (Genera la carpeta /dist)
RUN pnpm run build

# Opcional: Eliminar dependencias de desarrollo para ahorrar espacio en Render
RUN pnpm prune --prod

EXPOSE 3000

# Ejecutar el comando de producción oficial
CMD ["node", "dist/main"]