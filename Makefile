.PHONY: install generate migrate migrate-create dev studio db-push db-reset

install:
	pnpm install

studio:
	pnpm prisma studio

dev:
	pnpm dev

DB_CONTAINER=tracevault-postgres
DB_VOLUME=tracevault_postgres

db-up:
	docker start $(DB_CONTAINER) || docker run -d --name $(DB_CONTAINER) -e POSTGRES_USER=tracevault -e POSTGRES_PASSWORD=tracevault -e POSTGRES_DB=tracevault -p 5433:5432 -v $(DB_VOLUME):/var/lib/postgresql/data postgres:16

db-down:
	docker stop $(DB_CONTAINER)
	docker rm $(DB_CONTAINER)

db-reset:
	docker stop $(DB_CONTAINER) || exit 0
	docker rm $(DB_CONTAINER) || exit 0
	docker volume rm $(DB_VOLUME) || exit 0
	docker run -d --name $(DB_CONTAINER) -e POSTGRES_USER=tracevault -e POSTGRES_PASSWORD=tracevault -e POSTGRES_DB=tracevault -p 5433:5432 -v $(DB_VOLUME):/var/lib/postgresql/data postgres:16

db-logs:
	docker logs -f $(DB_CONTAINER)

migrate-reset:
	pnpm prisma migrate reset

migrate-create:
	pnpm prisma migrate dev --name $(name)

generate:
	pnpm prisma generate

test-db-create:
	psql -h localhost -p 5433 -U tracevault -c "CREATE DATABASE tracevault_test;" || true

test-db-drop:
	psql -h localhost -p 5433 -U tracevault -c "DROP DATABASE IF EXISTS tracevault_test;"

test-db-migrate:
	DATABASE_URL=postgresql://tracevault:tracevault@localhost:5433/tracevault_test pnpm prisma migrate deploy

test:
	make test-db-drop
	make test-db-create
	make test-db-migrate
	DATABASE_URL=postgresql://tracevault:tracevault@localhost:5433/tracevault_test pnpm jest --runInBand
	make test-db-drop