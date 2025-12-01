# 🐳 Docker - Deploy Rápido

## ⚡ Deploy em 3 Passos

### 1. Preparar arquivo .env

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="mysql://u264518018_TDash:Medup1302@@193.203.175.238:3306/u264518018_TDash?schema=public"
FRONTEND_PORT=80
```

### 2. Upload para hospedagem

Faça upload de toda a pasta `medup-tdash/` para sua hospedagem.

### 3. Executar (via SSH)

```bash
cd /caminho/para/medup-tdash
docker-compose -f docker-compose.prod.yml up -d --build
```

Pronto! Acesse seu domínio.

## 📋 Arquivos Criados

- ✅ `backend/Dockerfile` - Container do backend
- ✅ `frontend/Dockerfile` - Container do frontend com Nginx
- ✅ `frontend/nginx.conf` - Configuração do Nginx
- ✅ `docker-compose.yml` - Orquestração (desenvolvimento)
- ✅ `docker-compose.prod.yml` - Orquestração (produção)
- ✅ `.dockerignore` - Arquivos ignorados no build

## 🔧 Comandos Úteis

```bash
# Iniciar
docker-compose -f docker-compose.prod.yml up -d

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# Parar
docker-compose -f docker-compose.prod.yml down

# Reconstruir
docker-compose -f docker-compose.prod.yml up -d --build
```

## 🌐 Acesso

- Frontend: `http://seu-dominio.com`
- API: `http://seu-dominio.com/api`

O Nginx faz proxy automático para o backend.

