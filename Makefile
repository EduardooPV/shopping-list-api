.PHONY: dev stop install

## Sobe postgres (Docker) + API + App localmente com hot reload
dev:
	docker compose up -d postgres --remove-orphans
	@(cd api && npm run dev) & \
	(cd app && npm run dev) & \
	wait

## Instala dependências da API e do App
install:
	cd api && npm install
	@[ -f app/package.json ] && (cd app && npm install) || true

## Para API, App e postgres
stop:
	@echo "Parando processos..."
	@lsof -ti:3333 | xargs kill 2>/dev/null || true
	@lsof -ti:3000 | xargs kill 2>/dev/null || true
	@docker compose stop postgres
	@echo "✓ Tudo parado"

.DEFAULT_GOAL := dev
