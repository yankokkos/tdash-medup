#!/bin/bash

# Script de Deploy - TDash MedUp
# Uso: ./deploy.sh

set -e

echo "🚀 Iniciando deploy do TDash MedUp..."

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor, instale o Docker primeiro."
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

# Verificar se arquivo .env existe
if [ ! -f .env ]; then
    echo "⚠️  Arquivo .env não encontrado!"
    echo "📝 Criando arquivo .env a partir do .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ Arquivo .env criado. Por favor, edite com suas credenciais."
        exit 1
    else
        echo "❌ Arquivo .env.example não encontrado. Criando .env básico..."
        cat > .env << EOF
DATABASE_URL="mysql://usuario:senha@host:3306/nome_banco?schema=public"
FRONTEND_PORT=80
EOF
        echo "✅ Arquivo .env criado. Por favor, edite com suas credenciais."
        exit 1
    fi
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

# Construir e iniciar containers
echo "🔨 Construindo e iniciando containers..."
docker-compose -f docker-compose.prod.yml up -d --build

# Aguardar containers iniciarem
echo "⏳ Aguardando containers iniciarem..."
sleep 10

# Verificar status
echo "📊 Status dos containers:"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "✅ Deploy concluído!"
echo "🌐 Acesse: http://localhost:${FRONTEND_PORT:-80}"
echo ""
echo "📋 Para ver logs: docker-compose -f docker-compose.prod.yml logs -f"

