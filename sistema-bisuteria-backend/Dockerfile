FROM node:22-alpine

WORKDIR /app

# Copiamos solo el package.json (Ignoramos pnpm-lock y .npmrc para que no interfieran)
COPY package.json ./

# Usamos npm para instalar de forma limpia y directa en Render
RUN npm install

# Copiamos el resto del código de NestJS
COPY . .

# Construimos el proyecto (Genera la carpeta dist)
RUN npm run build

EXPOSE 3000

# Arrancamos la aplicación apuntando al archivo de producción
CMD ["node", "dist/main.js"]