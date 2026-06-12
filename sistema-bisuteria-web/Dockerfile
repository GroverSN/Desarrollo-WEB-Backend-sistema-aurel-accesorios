FROM node:22-alpine AS builder

WORKDIR /app

# Copiamos solo el package.json (Ignoramos pnpm-lock para evitar el bloqueo)
COPY package.json ./

# 🚀 LA SOLUCIÓN: Usamos npm para saltarnos el validador estricto de Render
# Usamos --legacy-peer-deps por si alguna dependencia de Vue protesta por versiones
RUN npm install --legacy-peer-deps

# Copiamos todo el resto del código de tu frontend de Vue
COPY . .

# Inyectar la URL real de tu backend en Render
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Inyectar tu número de WhatsApp para el catálogo
ARG VITE_WHATSAPP_NUMBER
ENV VITE_WHATSAPP_NUMBER=$VITE_WHATSAPP_NUMBER

# Compilar Vue (Esto generará la carpeta estática /app/dist)
RUN npm run build

# --- ETAPA RUNNER (Nginx sirve los archivos estáticos) ---
FROM nginx:alpine AS runner

# Copiar los archivos compilados por Vue al directorio de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar tu archivo de configuración de rutas
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]