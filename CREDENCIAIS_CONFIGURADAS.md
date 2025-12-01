# ✅ Credenciais do Banco Configuradas

## Informações do Banco

- **Host**: 193.203.175.238 (alternativa: srv1056.hstgr.io)
- **Usuário**: u264518018_TDash
- **Senha**: Medup1302@
- **Banco**: u264518018_TDash (verificar se necessário)

## Arquivo .env Criado

O arquivo `backend/.env` foi criado com a seguinte configuração:

```env
DATABASE_URL="mysql://u264518018_TDash:Medup1302@@193.203.175.238:3306/u264518018_TDash?schema=public"
PORT=5000
NODE_ENV=development
```

## Próximos Passos

1. **Gerar cliente Prisma:**
   ```bash
   cd backend
   npm run prisma:generate
   ```

2. **Executar migrations:**
   ```bash
   npm run prisma:migrate
   ```
   Isso criará todas as tabelas no banco remoto.

3. **Popular meses iniciais:**
   Execute no phpMyAdmin ou cliente MySQL:
   ```sql
   INSERT INTO meses (ano, mes, nome, nome_exibicao, ativo, created_at)
   VALUES
     (2025, 11, 'novembro_2025', 'Novembro 2025', true, NOW()),
     (2025, 12, 'dezembro_2025', 'Dezembro 2025', true, NOW());
   ```

4. **Importar dados:**
   ```bash
   npm run import:json "../📶 Operacional MedUp - TDasH - Novembro 2025.json" novembro_2025
   npm run import:json "../📶 Operacional MedUp - TDasH - Dezembro 2025.json" dezembro_2025
   ```

5. **Executar aplicação:**
   ```bash
   cd ..
   npm run dev
   ```

## Verificar Conexão

Se houver problemas, teste a conexão:

```bash
mysql -h 193.203.175.238 -u u264518018_TDash -p
# Digite a senha: Medup1302@
```

Ou use o host alternativo no .env:
```env
DATABASE_URL="mysql://u264518018_TDash:Medup1302@@srv1056.hstgr.io:3306/u264518018_TDash?schema=public"
```

## Importante

- O arquivo `.env` contém credenciais sensíveis - não commite no Git
- Se o nome do banco for diferente, ajuste na URL do DATABASE_URL
- Certifique-se de que o banco existe antes de executar migrations

