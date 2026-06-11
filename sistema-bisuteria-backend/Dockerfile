FROM node:22-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml .npmrc ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm run build
EXPOSE 3000
CMD ["node", "dist/main"]
