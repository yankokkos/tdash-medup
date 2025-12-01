# TDash MedUp - Sistema de Gerenciamento de Dados Operacionais

Sistema completo para gerenciamento de dados operacionais com frontend React e backend Node.js.

## 🚀 Deploy Rápido

### Opção 1: Coolify (Recomendado)

1. Faça push para Git
2. Conecte no Coolify apontando para este repositório
3. Configure a variável de ambiente `DATABASE_URL`
4. Deploy automático!

### Opção 2: Docker Compose

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

## 📋 Estrutura

```
medup-tdash/
├── backend/          # API Node.js + Express + Prisma
├── frontend/         # React + TypeScript + Vite
├── docker-compose.yml
└── docker-compose.prod.yml
```

## 🔧 Tecnologias

- **Frontend**: React 18, TypeScript, Vite, Material-UI
- **Backend**: Node.js, Express, TypeScript, Prisma
- **Database**: MySQL
- **Container**: Docker

## 📚 Configuração

Configure a variável de ambiente `DATABASE_URL` no Coolify ou no arquivo `.env` do backend:

```env
DATABASE_URL=mysql://usuario:senha@host:3306/banco?schema=public
```

## 🎯 Features

- ✅ Dashboard com estatísticas
- ✅ Lista de clientes com filtros avançados
- ✅ Edição de dados mensais
- ✅ Lista de pendências
- ✅ Comparação entre meses
- ✅ Importação de dados JSON/CSV

## 📝 Variáveis de Ambiente

```env
DATABASE_URL=mysql://usuario:senha@host:3306/banco?schema=public
NODE_ENV=production
PORT=5000
FRONTEND_PORT=80
```

## 🔄 Desenvolvimento

```bash
# Instalar dependências
npm run install:all

# Desenvolvimento
npm run dev

# Build
cd backend && npm run build
cd frontend && npm run build
```

## 📄 Licença

ISC
