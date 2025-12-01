# Quick Start - Sistema TDash MedUp

## Início Rápido (5 minutos)

### 1. Instalar Dependências
```bash
npm run install:all
```

### 2. Configurar Banco de Dados

Crie o banco:
```sql
CREATE DATABASE medup_tdash CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Configure `.env` no backend:
```env
DATABASE_URL="mysql://root:senha@localhost:3306/medup_tdash"
PORT=5000
NODE_ENV=development
```

### 3. Setup Prisma
```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

### 4. Popular Meses
```sql
INSERT INTO meses (ano, mes, nome, nome_exibicao, ativo, created_at)
VALUES
  (2025, 11, 'novembro_2025', 'Novembro 2025', true, NOW()),
  (2025, 12, 'dezembro_2025', 'Dezembro 2025', true, NOW());
```

### 5. Importar Dados
```bash
cd backend
npm run import:json "../📶 Operacional MedUp - TDasH - Novembro 2025.json" novembro_2025
npm run import:json "../📶 Operacional MedUp - TDasH - Dezembro 2025.json" dezembro_2025
```

### 6. Executar
```bash
# Voltar para raiz
cd ..
npm run dev
```

Acesse: http://localhost:3000

## Estrutura de Dados

O sistema separa:
- **Dados Fixos**: CNPJ, Razão Social, Município (tabela `clientes`)
- **Dados Mensais**: Faturamento, Transmissões, DAS, Honorários (tabelas relacionadas)

## Funcionalidades Principais

1. **Visualizar Clientes**: Página `/clientes`
2. **Filtrar**: Por mês, município, segmento, status
3. **Buscar**: CNPJ, nome, razão social
4. **Editar**: Clique em "Editar" na tabela
5. **Copiar**: Botão ao lado do CNPJ
6. **Abrir Links**: Botões para Google Drive e ClickUp

## Comandos Úteis

```bash
# Ver dados no Prisma Studio
cd backend
npm run prisma:studio

# Verificar status da importação
curl http://localhost:5000/api/import/status/JOB_ID

# Ver estatísticas
curl http://localhost:5000/api/dashboard/estatisticas
```

