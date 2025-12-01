# Instruções de Instalação - Sistema TDash MedUp

## Passo a Passo Completo

### 1. Pré-requisitos

Certifique-se de ter instalado:
- Node.js 18 ou superior
- MySQL 8 ou superior
- npm ou yarn

### 2. Configuração do Banco de Dados

1. Crie o banco de dados MySQL:
```sql
CREATE DATABASE medup_tdash CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Configure a conexão:
   - No diretório `backend`, copie `.env.example` para `.env`
   - Edite o arquivo `.env` e configure a `DATABASE_URL`:
   ```
   DATABASE_URL="mysql://seu_usuario:sua_senha@localhost:3306/medup_tdash"
   ```

### 3. Instalação das Dependências

Execute no diretório raiz:
```bash
npm run install:all
```

Isso instalará as dependências do projeto raiz, backend e frontend.

### 4. Configuração do Prisma

1. Gere o cliente Prisma:
```bash
cd backend
npm run prisma:generate
```

2. Execute as migrations:
```bash
npm run prisma:migrate
```

Isso criará todas as tabelas no banco de dados.

### 5. Popular Dados Iniciais

Execute o script SQL para criar os meses:
```bash
mysql -u seu_usuario -p medup_tdash < database/seeds/meses.sql
```

Ou execute manualmente no MySQL:
```sql
INSERT INTO meses (ano, mes, nome, nome_exibicao, ativo, created_at)
VALUES
  (2025, 11, 'novembro_2025', 'Novembro 2025', true, NOW()),
  (2025, 12, 'dezembro_2025', 'Dezembro 2025', true, NOW());
```

### 6. Importação de Dados

#### Importar JSON (Novembro 2025):
```bash
cd backend
npm run import:json "../📶 Operacional MedUp - TDasH - Novembro 2025.json" novembro_2025
```

#### Importar JSON (Dezembro 2025):
```bash
cd backend
npm run import:json "../📶 Operacional MedUp - TDasH - Dezembro 2025.json" dezembro_2025
```

**Nota**: Ajuste o caminho do arquivo conforme necessário.

### 7. Executar a Aplicação

#### Modo Desenvolvimento:
```bash
# No diretório raiz
npm run dev
```

Isso iniciará:
- Backend na porta 5000: http://localhost:5000
- Frontend na porta 3000: http://localhost:3000

#### Modo Produção:
```bash
# Build
npm run build

# Executar backend
cd backend
npm start
```

### 8. Acessar a Aplicação

Abra o navegador em: http://localhost:3000

## Estrutura de URLs da API

- `GET /api/health` - Health check
- `GET /api/clientes` - Lista clientes
- `GET /api/clientes/:id` - Detalhes do cliente
- `PUT /api/clientes/:id` - Atualiza cliente
- `GET /api/meses` - Lista meses
- `GET /api/meses/:mesId/clientes` - Clientes de um mês
- `GET /api/dados-mensais/cliente/:id/mes/:mesId` - Dados mensais
- `POST /api/import/json` - Importa JSON
- `GET /api/dashboard/estatisticas` - Estatísticas

## Troubleshooting

### Erro de conexão com banco
- Verifique se o MySQL está rodando
- Confirme as credenciais no `.env`
- Teste a conexão: `mysql -u usuario -p medup_tdash`

### Erro ao importar dados
- Verifique se o caminho do arquivo está correto
- Confirme que o arquivo JSON está no formato esperado
- Veja os logs no console para mais detalhes

### Erro no frontend
- Verifique se o backend está rodando
- Confirme que a porta 5000 está livre
- Veja o console do navegador para erros

## Próximos Passos

1. Importe os dados dos arquivos JSON
2. Explore a interface de clientes
3. Use os filtros para encontrar clientes específicos
4. Edite dados usando o formulário
5. Visualize estatísticas no dashboard

