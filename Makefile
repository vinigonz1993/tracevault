.PHONY: install generate migrate migrate-create dev studio db db-down db-reset app test web

DB_CONTAINER=tracevault-postgres
DB_VOLUME=tracevault_postgres

install:
	pnpm install
	pnpm prisma generate

db:
	docker start $(DB_CONTAINER) || docker run -d --name $(DB_CONTAINER) -e POSTGRES_USER=tracevault -e POSTGRES_PASSWORD=tracevault -e POSTGRES_DB=tracevault -p 5433:5432 -v $(DB_VOLUME):/var/lib/postgresql/data postgres:16
	pnpm prisma migrate deploy

db-down:
	docker stop $(DB_CONTAINER)
	docker rm $(DB_CONTAINER)

db-reset:
	docker stop $(DB_CONTAINER) || exit 0
	docker rm $(DB_CONTAINER) || exit 0
	docker volume rm $(DB_VOLUME) || exit 0
	docker run -d --name $(DB_CONTAINER) -e POSTGRES_USER=tracevault -e POSTGRES_PASSWORD=tracevault -e POSTGRES_DB=tracevault -p 5433:5432 -v $(DB_VOLUME):/var/lib/postgresql/data postgres:16

app:
	pnpm prisma generate
	pnpm run dev

web:
	pnpm --dir src/web dev

test:
	-docker rm -f $(DB_CONTAINER)_test
	-docker volume rm $(DB_VOLUME)_test

	docker run -d --name $(DB_CONTAINER)_test \
		-e POSTGRES_USER=tracevault \
		-e POSTGRES_PASSWORD=tracevault \
		-e POSTGRES_DB=tracevault_test \
		-p 5435:5432 \
		-v $(DB_VOLUME)_test:/var/lib/postgresql/data \
		postgres:16

	node scripts/wait-for-db.mjs $(DB_CONTAINER)_test

	node scripts/migrate-test.mjs

	pnpm test

	-docker rm -f $(DB_CONTAINER)_test
	-docker volume rm $(DB_VOLUME)_test