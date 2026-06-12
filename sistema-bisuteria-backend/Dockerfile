FROM node:22-alpine

WORKDIR /app

# Copiamos solo el package.json
COPY package.json ./

# 🚀 LA SOLUCIÓN: Forzamos la instalación ignorando los conflictos de versiones antiguas
RUN npm install --legacy-peer-deps

# Copiamos el resto del código de NestJS
COPY . .

# Construimos el proyecto (Genera la carpeta dist)
RUN npm run build

EXPOSE 3000

# Arrancamos la aplicación apuntando al archivo de producción
CMD ["node", "dist/main.js"]