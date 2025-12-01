# Configuração do Banco de Dados

## Credenciais Fornecidas

- **Usuário**: u264518018_TDash
- **Senha**: Medup1302@
- **Host**: 193.203.175.238 (ou srv1056.hstgr.io)
- **Porta**: 3306 (padrão MySQL)
- **Banco**: u264518018_TDash (assumido - verificar se necessário)

## Configurar arquivo .env

Crie o arquivo `backend/.env` com o seguinte conteúdo:

```env
DATABASE_URL="mysql://u264518018_TDash:Medup1302@@193.203.175.238:3306/u264518018_TDash?schema=public"
PORT=5000
NODE_ENV=development
```

**IMPORTANTE**: Se o nome do banco for diferente de `u264518018_TDash`, ajuste na URL acima.

## Testar Conexão

Após configurar, teste a conexão:

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

Se houver erro de conexão, verifique:
1. Se o host está acessível
2. Se as credenciais estão corretas
3. Se o banco de dados existe
4. Se o firewall permite conexões na porta 3306

## Alternativa: Host srv1056.hstgr.io

Se o primeiro host não funcionar, use:
```env
DATABASE_URL="mysql://u264518018_TDash:Medup1302@@srv1056.hstgr.io:3306/u264518018_TDash?schema=public"
```

