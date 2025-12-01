# Troubleshooting - Coolify Deployment

## Problema: Erro 502 Bad Gateway

Se você está recebendo erros 502 ao acessar as APIs, siga estes passos:

### 1. Verificar se o Backend está rodando

No painel do Coolify:
1. Vá para o seu aplicativo
2. Verifique os logs do container `backend`
3. Procure por mensagens como:
   - `🚀 Server running on http://0.0.0.0:5000`
   - `✅ Health check available`

### 2. Verificar conectividade entre containers

Execute no terminal do Coolify (ou via SSH no servidor):

```bash
# Verificar se o backend está rodando
docker ps | grep backend

# Verificar logs do backend
docker logs <container-id-backend>

# Testar conectividade do frontend para o backend
docker exec <container-id-frontend> ping backend
```

### 3. Verificar rede Docker

Os containers devem estar na mesma rede. Verifique:

```bash
docker network inspect <network-name>
```

Ambos os containers (`backend` e `frontend`) devem aparecer na mesma rede.

### 4. Configuração do Coolify

No Coolify, você pode precisar configurar rotas separadas:

#### Opção A: Usar apenas o Frontend (Recomendado)
- O frontend faz proxy para o backend via nginx
- Configure apenas o serviço `frontend` como principal no Coolify
- O Coolify deve rotear todo o tráfego para o frontend
- O nginx do frontend faz proxy para `/api/*` para o backend

#### Opção B: Configurar rotas separadas
Se o Coolify suportar múltiplas rotas:
- Rota `/` → serviço `frontend`
- Rota `/api/*` → serviço `backend`

### 5. Verificar variáveis de ambiente

No painel do Coolify, verifique se `DATABASE_URL` está configurado:

```
DATABASE_URL=mysql://u264518018_TDash:Medup1302@@193.203.175.238:3306/u264518018_TDash?schema=public
```

### 6. Testar backend diretamente

Se possível, teste o backend diretamente:

```bash
# Dentro do container do backend
curl http://localhost:5000/
curl http://localhost:5000/api/health
```

### 7. Verificar logs do Nginx

```bash
# Logs do frontend
docker logs <container-id-frontend>

# Verificar erros de proxy
docker logs <container-id-frontend> 2>&1 | grep -i "proxy\|502\|error"
```

### 8. Solução alternativa: Configurar Coolify para proxy direto

Se o nginx não conseguir fazer proxy, configure o Coolify para fazer proxy direto:

1. No painel do Coolify, vá para configurações do aplicativo
2. Configure rotas:
   - `/` → `frontend:80`
   - `/api/*` → `backend:5000`

Isso requer que o Coolify suporte múltiplas rotas de proxy.

## Verificação Rápida

Execute este script para verificar tudo:

```bash
#!/bin/bash
echo "=== Verificando Containers ==="
docker ps | grep -E "backend|frontend"

echo -e "\n=== Verificando Rede ==="
docker network ls | grep tdash

echo -e "\n=== Testando Backend ==="
BACKEND_CONTAINER=$(docker ps | grep backend | awk '{print $1}')
if [ ! -z "$BACKEND_CONTAINER" ]; then
    docker exec $BACKEND_CONTAINER curl -s http://localhost:5000/ || echo "Backend não responde"
else
    echo "Backend não está rodando"
fi

echo -e "\n=== Testando Conectividade ==="
FRONTEND_CONTAINER=$(docker ps | grep frontend | awk '{print $1}')
if [ ! -z "$FRONTEND_CONTAINER" ]; then
    docker exec $FRONTEND_CONTAINER ping -c 1 backend || echo "Frontend não consegue alcançar backend"
else
    echo "Frontend não está rodando"
fi
```

## Próximos Passos

Se o problema persistir:

1. Verifique os logs completos do backend e frontend
2. Verifique se o backend está realmente iniciando (não está crashando)
3. Verifique se a rede Docker está configurada corretamente
4. Considere usar apenas um serviço (backend) e servir o frontend como estático do próprio backend

