# 🚀 Deploy no Coolify - TDash MedUp

## 📋 Pré-requisitos

- Conta no Coolify
- Repositório Git (GitHub, GitLab, etc.)
- Acesso ao banco de dados MySQL

## 🔧 Configuração no Coolify

### 1. Criar Novo Projeto

1. Acesse seu Coolify
2. Clique em "New Project"
3. Nome: `tdash-medup`
4. Selecione seu repositório Git

### 2. Configurar Aplicação

#### Backend

1. **Tipo**: Docker Compose ou Dockerfile
2. **Dockerfile Path**: `backend/Dockerfile`
3. **Context**: `backend/`
4. **Port**: 5000 (interno)
5. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=mysql://u264518018_TDash:Medup1302@@193.203.175.238:3306/u264518018_TDash?schema=public
   ```

#### Frontend

1. **Tipo**: Docker Compose ou Dockerfile
2. **Dockerfile Path**: `frontend/Dockerfile`
3. **Context**: `frontend/`
4. **Port**: 80
5. **Public Port**: 80 (ou a porta que o Coolify designar)

### 3. Usando Docker Compose (Recomendado)

Se o Coolify suportar Docker Compose:

1. Selecione "Docker Compose" como tipo
2. **Compose File**: `docker-compose.prod.yml`
3. **Environment Variables**:
   ```
   DATABASE_URL=mysql://u264518018_TDash:Medup1302@@193.203.175.238:3306/u264518018_TDash?schema=public
   FRONTEND_PORT=80
   ```

## 📝 Variáveis de Ambiente

Configure no Coolify:

```env
# Database
DATABASE_URL=mysql://u264518018_TDash:Medup1302@@193.203.175.238:3306/u264518018_TDash?schema=public

# Backend
NODE_ENV=production
PORT=5000

# Frontend (se necessário)
FRONTEND_PORT=80
```

## 🔄 Fluxo de Deploy

1. **Push para Git**: Faça commit e push das mudanças
2. **Coolify detecta**: O Coolify detecta automaticamente o push
3. **Build automático**: Constrói as imagens Docker
4. **Deploy**: Faz deploy automaticamente
5. **Health Check**: Verifica se os serviços estão rodando

## 🌐 URLs

Após o deploy, o Coolify fornecerá:
- **Frontend**: `https://seu-app.coolify.io` (ou seu domínio customizado)
- **Backend**: Acessível internamente via rede Docker

## 🔧 Configuração de Domínio Customizado

1. No Coolify, vá em "Domains"
2. Adicione seu domínio
3. Configure DNS apontando para o Coolify
4. O Coolify configurará SSL automaticamente

## 📊 Monitoramento

O Coolify fornece:
- Logs em tempo real
- Status dos containers
- Métricas de uso
- Histórico de deploys

## 🔄 Atualizações

Para atualizar:

1. Faça suas alterações no código
2. Commit e push para Git
3. O Coolify detecta e faz deploy automaticamente

Ou manualmente:

1. No Coolify, clique em "Redeploy"
2. Escolha o commit/branch desejado

## 🐛 Troubleshooting

### Build falha

- Verifique os logs no Coolify
- Confirme que todas as variáveis de ambiente estão configuradas
- Verifique se o Dockerfile está correto

### Backend não conecta ao banco

- Verifique a variável `DATABASE_URL`
- Confirme que o banco está acessível do servidor Coolify
- Verifique firewall/security groups

### Frontend não carrega

- Verifique se o backend está rodando
- Confira os logs do frontend
- Teste acessando `/api/` diretamente

## 📋 Checklist

- [ ] Repositório Git configurado
- [ ] Coolify conectado ao repositório
- [ ] Variáveis de ambiente configuradas
- [ ] Dockerfiles corretos
- [ ] Primeiro deploy executado
- [ ] Domínio configurado (opcional)
- [ ] SSL configurado (automático no Coolify)
- [ ] Testes realizados

## 🎯 Dicas

1. **Use branches**: Configure diferentes ambientes (staging/production)
2. **Variáveis secretas**: Use as variáveis de ambiente do Coolify para dados sensíveis
3. **Backups**: Configure backup do banco de dados
4. **Monitoramento**: Use os recursos de monitoramento do Coolify

