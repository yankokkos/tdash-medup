# Setup Rápido com Credenciais Fornecidas

## 1. Instalar Dependências

```bash
npm run install:all
```

## 2. Configurar Banco de Dados

O arquivo `.env` já foi criado no backend com as credenciais fornecidas.

Se precisar ajustar, edite `backend/.env`:
```env
DATABASE_URL="mysql://u264518018_TDash:Medup1302@@193.203.175.238:3306/u264518018_TDash?schema=public"
PORT=5000
NODE_ENV=development
```

**Nota**: Se o nome do banco for diferente, ajuste na URL acima.

## 3. Setup Prisma

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

Isso criará todas as tabelas no banco remoto.

## 4. Popular Meses Iniciais

Execute no MySQL (via phpMyAdmin ou cliente MySQL):

```sql
INSERT INTO meses (ano, mes, nome, nome_exibicao, ativo, created_at)
VALUES
  (2025, 11, 'novembro_2025', 'Novembro 2025', true, NOW()),
  (2025, 12, 'dezembro_2025', 'Dezembro 2025', true, NOW())
ON DUPLICATE KEY UPDATE nome_exibicao = VALUES(nome_exibicao);
```

## 5. Importar Dados

```bash
# Ainda no diretório backend
npm run import:json "../📶 Operacional MedUp - TDasH - Novembro 2025.json" novembro_2025
npm run import:json "../📶 Operacional MedUp - TDasH - Dezembro 2025.json" dezembro_2025
```

**Ajuste os caminhos dos arquivos conforme necessário!**

## 6. Executar Aplicação

```bash
# Voltar para raiz
cd ..
npm run dev
```

Acesse: http://localhost:3000

## Verificar Conexão

Se houver problemas de conexão:

1. Teste a conexão MySQL diretamente:
```bash
mysql -h 193.203.175.238 -u u264518018_TDash -p
# Senha: Medup1302@
```

2. Verifique se o banco existe:
```sql
SHOW DATABASES;
USE u264518018_TDash;
SHOW TABLES;
```

3. Se o host 193.203.175.238 não funcionar, tente srv1056.hstgr.io no .env

## Próximos Passos

1. ✅ Banco configurado
2. ⏳ Executar migrations
3. ⏳ Popular meses
4. ⏳ Importar dados JSON
5. ⏳ Testar aplicação

