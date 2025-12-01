.PHONY: help build up down logs restart clean deploy

help: ## Mostra esta mensagem de ajuda
	@echo "Comandos disponíveis:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## Constrói os containers
	docker-compose -f docker-compose.prod.yml build

up: ## Inicia os containers
	docker-compose -f docker-compose.prod.yml up -d

down: ## Para os containers
	docker-compose -f docker-compose.prod.yml down

logs: ## Mostra os logs
	docker-compose -f docker-compose.prod.yml logs -f

restart: ## Reinicia os containers
	docker-compose -f docker-compose.prod.yml restart

clean: ## Remove containers, volumes e imagens
	docker-compose -f docker-compose.prod.yml down -v
	docker system prune -f

deploy: ## Faz deploy completo (build + up)
	docker-compose -f docker-compose.prod.yml up -d --build

status: ## Mostra status dos containers
	docker-compose -f docker-compose.prod.yml ps

