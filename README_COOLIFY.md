# 🚀 Coolify - Deploy Rápido

## ⚡ Setup em 3 Passos

### 1. Push para Git
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. No Coolify

1. **New Project** → Conecte seu repositório Git
2. **Tipo**: Docker Compose
3. **Compose File**: `docker-compose.prod.yml`
4. **Environment Variables**:
   ```
   DATABASE_URL=mysql://u264518018_TDash:Medup1302@@193.203.175.238:3306/u264518018_TDash?schema=public
   FRONTEND_PORT=80
   ```

### 3. Deploy

Coolify faz tudo automaticamente! 🎉

## 📝 Variáveis Necessárias

No Coolify, configure:

```
DATABASE_URL=mysql://usuario:senha@host:3306/banco?schema=public
FRONTEND_PORT=80
NODE_ENV=production
PORT=5000
```

## ✅ Pronto!

Acesse a URL fornecida pelo Coolify.

