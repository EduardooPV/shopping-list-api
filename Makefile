.PHONY: dev stop install

## Sobe postgres (Docker) + API + App localmente com hot reload
dev:
	docker compose up -d postgres --remove-orphans
	@trap 'kill 0' INT TERM; \
	(cd api && npm run dev) & \
	(cd app && npm run dev) & \
	wait

## Instala dependências da API e do App
install:
	cd api && npm install
	@[ -f app/package.json ] && (cd app && npm install) || true

## Para API, App e postgres
stop:
	@pkill -f "ts-node" 2>/dev/null || true
	@pkill -f "nodemon" 2>/dev/null || true
	@pkill -f "next" 2>/dev/null || true
	docker compose stop postgres
	@echo "✓ Tudo parado"

.DEFAULT_GOAL := dev
