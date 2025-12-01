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

# Instalar apenas dependências de produção (inclui @prisma/client)
RUN npm install --only=production --legacy-peer-deps || npm install --only=production

# Copiar Prisma Client gerado do builder (mais eficiente que gerar novamente)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copiar código compilado do stage anterior
COPY --from=builder /app/dist ./dist

# Expor porta
EXPOSE 5000

# Variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=5000

# Comando para iniciar
CMD ["node", "dist/index.js"]
