FROM node:22-alpine AS builder

WORKDIR /app

# Instalar pnpm de manera global en la etapa de construcción
RUN npm install -g pnpm

# Copiar las configuraciones correctas de pnpm de tu proyecto
COPY package.json pnpm-lock.yaml ./

# Evitar problemas de enlaces simbólicos en entornos aislados de Docker
RUN pnpm config set virtual-store-dir .pnpm

# Instalar dependencias usando el candado nativo de pnpm de forma limpia
RUN pnpm install --frozen-lockfile

COPY . .

# Inyectar la URL de producción de tu backend de Render
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Compilar el frontend de Vue (Generará la carpeta /app/dist)
RUN pnpm run build

# --- ETAPA RUNNER (Sigue siendo Nginx exactamente igual) ---
FROM nginx:alpine AS runner

# Vue por defecto compila todo dentro de la carpeta /dist, así que esto se queda igual
COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]