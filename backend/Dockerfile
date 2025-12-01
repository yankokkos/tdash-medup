# Backend Dockerfile - Multi-stage build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY tsconfig.json ./

# Instalar todas as dependências (incluindo devDependencies para build)
RUN npm install --legacy-peer-deps || npm install

# Copiar código fonte e Prisma
COPY prisma ./prisma/
COPY src ./src/

# Gerar Prisma Client
RUN npx prisma generate

# Build do TypeScript
RUN npm run build

# Stage 2 - Produção
FROM node:20-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar apenas dependências de produção
RUN npm install --only=production --legacy-peer-deps || npm install --only=production

# Instalar Prisma CLI temporariamente para gerar o client
RUN npm install prisma@latest --save-dev --legacy-peer-deps || npm install prisma@latest --save-dev

# Gerar Prisma Client
RUN npx prisma generate

# Remover Prisma CLI (não é necessário em runtime, apenas @prisma/client)
RUN npm uninstall prisma || true

# Copiar código compilado do stage anterior
COPY --from=builder /app/dist ./dist

# Garantir que @prisma/client está instalado
RUN npm install @prisma/client@latest --save --legacy-peer-deps || npm install @prisma/client@latest --save

# Expor porta
EXPOSE 5000

# Variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=5000

# Comando para iniciar
CMD ["node", "dist/index.js"]

