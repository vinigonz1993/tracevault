.PHONY: help install dev backend frontend up down logs db-reset prisma-generate prisma-migrate

help:
	@echo "Available commands:"
	@echo "  make install          Install dependencies"
	@echo "  make dev              Run frontend and backend"
	@echo "  make backend          Run backend only"
	@echo "  make frontend         Run frontend only"
	@echo "  make up               Start docker services"
	@echo "  make down             Stop docker services"
	@echo "  make logs             Show docker logs"
	@echo "  make prisma-generate  Generate Prisma client"
	@echo "  make prisma-migrate   Run Prisma migrations"
	@echo "  make db-reset         Reset database"


install:
	pnpm install


dev:
	pnpm --parallel dev


backend:
	cd apps/backend && pnpm start:dev


frontend:
	cd apps/frontend && pnpm dev


up:
	docker compose up -d


down:
	docker compose down


logs:
	docker compose logs -f


prisma-generate:
	cd apps/backend && pnpm dlx prisma generate


prisma-migrate:
	cd apps/backend && pnpm dlx prisma migrate dev


db-reset:
	cd apps/backend && pnpm dlx prisma migrate reset