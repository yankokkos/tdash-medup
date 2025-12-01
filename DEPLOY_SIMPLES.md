# Deploy Simples - TDash MedUp

## 📦 O que colocar na `public_html`

### 1. Frontend (Obrigatório)
Copie **TODOS os arquivos** da pasta:
```
medup-tdash/frontend/dist/
```
Para:
```
public_html/
```

Isso inclui:
- ✅ `index.html`
- ✅ Pasta `assets/` completa
- ✅ Arquivo `.htaccess` (já está incluído no guia)

### 2. Backend (Opcional - se sua hospedagem suporta Node.js)

Se sua hospedagem permite executar Node.js, crie uma pasta `api` no mesmo nível de `public_html`:

```
public_html/          ← Frontend aqui
api/                  ← Backend aqui
├── dist/
├── prisma/
├── package.json
├── .env
└── node_modules/
```

## 🚀 Passo a Passo Rápido

### Passo 1: Fazer Build
```bash
cd medup-tdash/frontend
npm run build
```

### Passo 2: Upload
1. Abra o File Manager do seu painel de hospedagem
2. Vá até a pasta `public_html`
3. Faça upload de **TODOS os arquivos** de `medup-tdash/frontend/dist/`
4. Inclua o arquivo `.htaccess` (se não existir)

### Passo 3: Configurar Backend (se necessário)

Se você tem acesso SSH e pode rodar Node.js:

1. Crie pasta `api` no mesmo nível de `public_html`
2. Faça upload de:
   - `backend/dist/` → `api/dist/`
   - `backend/prisma/` → `api/prisma/`
   - `backend/package.json` → `api/package.json`
3. Crie arquivo `api/.env`:
   ```env
   DATABASE_URL="mysql://u264518018_TDash:Medup1302@@193.203.175.238:3306/u264518018_TDash?schema=public"
   PORT=5000
   NODE_ENV=production
   ```
4. No SSH, execute:
   ```bash
   cd api
   npm install --production
   npx prisma generate
   pm2 start dist/index.js --name tdash-api
   ```

## ⚠️ Importante

- O frontend **PRECISA** do backend funcionando
- Se sua hospedagem não suporta Node.js, você pode:
  1. Usar um serviço separado para o backend (Heroku, Railway, etc.)
  2. Ou configurar o frontend para apontar para uma API externa

## 🔧 Se o Backend estiver em outro servidor

Edite `medup-tdash/frontend/src/services/api.ts` antes do build:

```typescript
const api = axios.create({
  baseURL: 'https://sua-api.com/api', // URL do seu backend
  headers: {
    'Content-Type': 'application/json',
  },
});
```

Depois faça o build novamente.

