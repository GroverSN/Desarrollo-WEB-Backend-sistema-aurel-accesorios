FROM node:22-alpine AS builder

WORKDIR /app

# Copiamos solo el package.json para usar la vía libre de npm
COPY package.json ./

# Instalamos de forma plana ignorando restricciones de Render
RUN npm install --legacy-peer-deps

# Copiamos el resto del código del sistema administrativo
COPY . .

# Declaramos las variables que Render inyectará en el build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

ARG VITE_WHATSAPP_NUMBER
ENV VITE_WHATSAPP_NUMBER=$VITE_WHATSAPP_NUMBER

# Compilar el panel administrativo de Vue (Genera /app/dist)
RUN npm run build

# --- ETAPA RUNNER (Servidor Nginx) ---
FROM nginx:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html

# Copiamos el archivo nginx.conf para que Vue Router funcione al recargar páginas
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]