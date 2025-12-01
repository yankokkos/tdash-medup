# 🚀 Guia Rápido de Deploy

## 📁 O que colocar na `public_html`

### ✅ SIM - Coloque na `public_html`:

Copie **TUDO** da pasta:
```
medup-tdash/frontend/dist/
```

**Conteúdo:**
- `index.html`
- Pasta `assets/` (com todos os arquivos CSS e JS)
- `.htaccess` (arquivo de configuração do Apache)

### ❌ NÃO - Não coloque na `public_html`:

- ❌ Pasta `backend/`
- ❌ Pasta `frontend/src/`
- ❌ Arquivos `.ts` ou `.tsx`
- ❌ `node_modules/`
- ❌ `package.json`

## 📋 Checklist de Upload

1. ✅ Fazer build do frontend: `cd frontend && npm run build`
2. ✅ Entrar no File Manager da hospedagem
3. ✅ Ir até a pasta `public_html`
4. ✅ Fazer upload de **TODOS os arquivos** de `frontend/dist/`
5. ✅ Verificar se o arquivo `.htaccess` foi enviado
6. ✅ Testar acessando seu domínio

## 🔧 Backend (Opcional)

Se sua hospedagem suporta Node.js, crie uma pasta `api` no mesmo nível de `public_html` e coloque:
- `backend/dist/`
- `backend/prisma/`
- `backend/package.json`
- `backend/.env` (com suas credenciais)

## 📝 Exemplo de Estrutura na Hospedagem

```
/
├── public_html/          ← AQUI vai o frontend
│   ├── index.html
│   ├── assets/
│   │   ├── index-*.css
│   │   └── index-*.js
│   └── .htaccess
│
└── api/                  ← AQUI vai o backend (se suportar Node.js)
    ├── dist/
    ├── prisma/
    ├── package.json
    └── .env
```

## ⚠️ Importante

- O frontend precisa se comunicar com o backend
- Se o backend estiver em outro servidor, edite `frontend/src/services/api.ts` antes do build
- Certifique-se de que o arquivo `.htaccess` está na `public_html`

