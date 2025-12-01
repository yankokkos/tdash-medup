# Guia de Deploy - TDash MedUp

## Estrutura de Deploy

### O que vai na pasta `public_html`:
- **Apenas os arquivos do frontend compilado** (pasta `frontend/dist/`)

### O que vai em outra pasta (ex: `api` ou `backend`):
- **Arquivos do backend compilado** (pasta `backend/dist/`)
- **Arquivos de configuração** (`.env`, `package.json`, `node_modules`)

## Passo a Passo

### 1. Preparar os Builds

```bash
# No diretório raiz do projeto
cd medup-tdash/frontend
npm run build

cd ../backend
npm run build
```

### 2. Estrutura na Hospedagem

```
public_html/
├── index.html
├── assets/
│   ├── index-*.css
│   └── index-*.js
└── ... (outros arquivos estáticos)

api/  (ou backend/)
├── dist/
│   ├── index.js
│   ├── routes/
│   ├── controllers/
│   └── ...
├── prisma/
│   └── schema.prisma
├── node_modules/
├── package.json
└── .env
```

### 3. Upload dos Arquivos

#### Frontend (public_html):
1. Copie **TUDO** da pasta `medup-tdash/frontend/dist/` para `public_html/`
2. Isso inclui:
   - `index.html`
   - Pasta `assets/` completa

#### Backend (api/ ou backend/):
1. Crie uma pasta `api` ou `backend` no mesmo nível de `public_html`
2. Copie:
   - `medup-tdash/backend/dist/` → `api/dist/`
   - `medup-tdash/backend/prisma/` → `api/prisma/`
   - `medup-tdash/backend/package.json` → `api/package.json`
   - `medup-tdash/backend/.env` → `api/.env` (ajuste as credenciais)

### 4. Configurar Backend

Na pasta `api/`:

```bash
# Instalar dependências
npm install --production

# Gerar Prisma Client
npx prisma generate

# Criar arquivo .env com suas credenciais
```

Arquivo `.env`:
```env
DATABASE_URL="mysql://u264518018_TDash:Medup1302@@193.203.175.238:3306/u264518018_TDash?schema=public"
PORT=5000
NODE_ENV=production
```

### 5. Configurar Frontend para Produção

O frontend precisa apontar para a URL do backend. Você tem duas opções:

#### Opção A: Backend na mesma hospedagem (recomendado)

Edite `medup-tdash/frontend/vite.config.ts` antes do build:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
});
```

E configure um proxy no servidor web (Apache/Nginx) ou use um arquivo `.htaccess`:

**Arquivo `.htaccess` em `public_html/`:**

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Proxy para API
  RewriteCond %{REQUEST_URI} ^/api/(.*)$
  RewriteRule ^api/(.*)$ http://localhost:5000/api/$1 [P,L]
  
  # React Router - redirecionar tudo para index.html
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

#### Opção B: Backend em URL diferente

Edite `medup-tdash/frontend/src/services/api.ts` antes do build:

```typescript
const api = axios.create({
  baseURL: 'https://seu-dominio.com/api', // ou a URL do seu backend
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### 6. Configurar Process Manager (PM2 ou similar)

Para manter o backend rodando, use PM2:

```bash
# Na pasta api/
npm install -g pm2
pm2 start dist/index.js --name tdash-api
pm2 save
pm2 startup
```

### 7. Verificar Permissões

```bash
# Dar permissões necessárias
chmod 755 public_html
chmod 644 public_html/index.html
chmod 755 api
```

## Resumo dos Arquivos

### public_html/ (Frontend)
```
✅ index.html
✅ assets/index-*.css
✅ assets/index-*.js
✅ .htaccess (se usar Apache)
```

### api/ (Backend)
```
✅ dist/ (todos os arquivos compilados)
✅ prisma/schema.prisma
✅ package.json
✅ .env
✅ node_modules/ (instalar com npm install --production)
```

## Checklist de Deploy

- [ ] Build do frontend executado (`npm run build` em `frontend/`)
- [ ] Build do backend executado (`npm run build` em `backend/`)
- [ ] Arquivos de `frontend/dist/` copiados para `public_html/`
- [ ] Arquivos do backend copiados para `api/`
- [ ] Arquivo `.env` configurado na pasta `api/`
- [ ] `npm install --production` executado na pasta `api/`
- [ ] `npx prisma generate` executado na pasta `api/`
- [ ] Backend iniciado (PM2 ou similar)
- [ ] `.htaccess` configurado (se usar Apache)
- [ ] Testar acesso ao frontend
- [ ] Testar chamadas à API

## URLs Esperadas

- Frontend: `https://seu-dominio.com/`
- API: `https://seu-dominio.com/api/` (se usar proxy)
- Ou: `https://api.seu-dominio.com/` (se usar subdomínio)

