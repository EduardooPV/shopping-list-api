.PHONY: dev stop install

## Sobe postgres (Docker) + API + App localmente com hot reload
dev:
	docker compose up -d postgres
	@(cd api && npm run dev) & \
	(cd app && npm run dev)

## Instala dependências da API e do App
install:
	cd api && npm install
	cd app && npm install

## Para API, App e postgres
stop:
	@pkill -f "nodemon" 2>/dev/null || true
	@pkill -f "next" 2>/dev/null || true
	docker compose stop postgres
	@echo "✓ Tudo parado"

.DEFAULT_GOAL := dev
