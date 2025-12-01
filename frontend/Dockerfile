# Frontend Dockerfile - Multi-stage build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências (npm install funciona mesmo sem package-lock.json)
RUN npm install --legacy-peer-deps || npm install

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Stage 2 - Nginx para servir arquivos estáticos
FROM nginx:alpine

# Copiar arquivos buildados
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

