# 🐳 Deploy com Docker - TDash MedUp

## 📋 Pré-requisitos

- Docker instalado na hospedagem
- Docker Compose instalado
- Acesso SSH à hospedagem

## 🚀 Deploy Rápido

### 1. Preparar Arquivos

Certifique-se de que os builds estão prontos:

```bash
# Build do backend
cd backend
npm run build

# Build do frontend
cd ../frontend
npm run build
```

### 2. Criar Arquivo .env

Na raiz do projeto, crie um arquivo `.env`:

```env
DATABASE_URL="mysql://u264518018_TDash:Medup1302@@193.203.175.238:3306/u264518018_TDash?schema=public"
PORT=5000
NODE_ENV=production
```

### 3. Upload para Hospedagem

Faça upload de toda a pasta `medup-tdash/` para sua hospedagem via:
- FTP/SFTP
- Git (recomendado)
- File Manager

### 4. Na Hospedagem (via SSH)

```bash
# Ir para a pasta do projeto
cd /caminho/para/medup-tdash

# Construir e iniciar containers
docker-compose up -d --build

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f
```

## 📁 Estrutura de Arquivos

```
medup-tdash/
├── docker-compose.yml      ← Arquivo principal
├── .env                    ← Variáveis de ambiente
├── backend/
│   ├── Dockerfile
│   ├── dist/              ← Build do backend
│   ├── prisma/
│   └── package.json
└── frontend/
    ├── Dockerfile
    ├── nginx.conf         ← Configuração do nginx
    └── dist/              ← Build do frontend (gerado automaticamente)
```

## 🔧 Comandos Úteis

```bash
# Iniciar containers
docker-compose up -d

# Parar containers
docker-compose down

# Ver logs
docker-compose logs -f

# Reconstruir após mudanças
docker-compose up -d --build

# Parar e remover tudo
docker-compose down -v

# Ver status
docker-compose ps
```

## 🌐 Portas

- **Frontend**: Porta 80 (HTTP)
- **Backend**: Porta 5000 (interno, não exposto externamente)

O nginx no frontend faz proxy para o backend automaticamente.

## 🔒 Segurança

### Variáveis de Ambiente

Nunca commite o arquivo `.env` no Git. Use `.env.example` como template.

### Firewall

Configure o firewall para:
- Permitir porta 80 (HTTP)
- Permitir porta 443 (HTTPS, se usar SSL)
- Bloquear porta 5000 (backend não deve ser acessível externamente)

## 🔄 Atualizações

Para atualizar a aplicação:

```bash
# 1. Fazer upload das mudanças
# 2. Reconstruir containers
docker-compose up -d --build

# 3. Verificar logs
docker-compose logs -f
```

## 🐛 Troubleshooting

### Containers não iniciam

```bash
# Ver logs de erro
docker-compose logs

# Verificar se as portas estão livres
netstat -tulpn | grep :80
netstat -tulpn | grep :5000
```

### Backend não conecta ao banco

- Verifique o arquivo `.env`
- Teste a conexão do banco de dados
- Verifique se o Prisma Client foi gerado: `docker-compose exec backend npx prisma generate`

### Frontend não carrega

- Verifique os logs do nginx: `docker-compose logs frontend`
- Verifique se os arquivos foram buildados corretamente
- Teste acessando diretamente: `http://seu-dominio.com/api/`

## 📝 Checklist de Deploy

- [ ] Builds do frontend e backend executados
- [ ] Arquivo `.env` criado com credenciais corretas
- [ ] Arquivos enviados para hospedagem
- [ ] Docker e Docker Compose instalados
- [ ] Containers iniciados com `docker-compose up -d`
- [ ] Logs verificados sem erros
- [ ] Aplicação acessível via navegador
- [ ] API respondendo em `/api/`

## 🎯 Deploy em Produção

Para produção, considere:

1. **SSL/HTTPS**: Configure certificado SSL e atualize nginx.conf
2. **Domínio**: Configure DNS apontando para o servidor
3. **Backup**: Configure backup automático do banco de dados
4. **Monitoramento**: Configure logs e monitoramento
5. **Firewall**: Configure regras de firewall adequadas

