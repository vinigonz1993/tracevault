# TraceVault

TraceVault is an API for tracking changes made to application objects, including the previous state, current state, operation, and user responsible for the change.

## Requirements

Make sure you have the following installed:

* [Node.js](https://nodejs.org/)
* [pnpm](https://pnpm.io/)
* [Docker](https://www.docker.com/)
* `make`

Docker must be running before starting the database.

## Installation

Install the project dependencies and generate the Prisma client:

```bash
make install
```

## Environment Variables

Check `.env.example` for the required environment variables.

Configure the database connection in `.env`.

Example:

```env
DATABASE_URL=postgresql://tracevault:tracevault@localhost:5433/tracevault
```

Do not commit `.env` to Git.

## Database

TraceVault uses PostgreSQL running in Docker.

### Start the database

```bash
make db
```

This starts the `tracevault-postgres` Docker container and runs all pending Prisma migrations.

The PostgreSQL server is available on:

```text
localhost:5433
```

Default credentials:

```text
User:     tracevault
Password: tracevault
Database: tracevault
Port:     5433
```

### Stop the database

```bash
make db-down
```

This stops and removes the PostgreSQL container while preserving the database volume.

### Reset the database

To completely remove the database and all its data:

```bash
make db-reset
```

The database will be recreated when you run:

```bash
make db
```

## Running the Application

Start the application with:

```bash
make app
```

For a fresh setup:

```bash
make install
make db
make app
```

## Tests

Run the complete test suite with:

```bash
make test
```

Tests use a separate PostgreSQL database running on port `5435`.

The test command creates a fresh database, runs the migrations, executes the tests, and removes the test database afterward.

Test database credentials:

```text
User:     tracevault
Password: tracevault
Database: tracevault_test
Port:     5435
```

## Prisma

Generate the Prisma client:

```bash
pnpm prisma generate
```

Create a migration:

```bash
pnpm prisma migrate dev --name <migration-name>
```

For example:

```bash
pnpm prisma migrate dev --name add_change_log
```

Apply existing migrations:

```bash
pnpm prisma migrate deploy
```

Open Prisma Studio:

```bash
pnpm prisma studio
```

## API

### Create Change Log

```http
POST /change-logs
```

Example request:

```json
{
  "objectId": "order-123",
  "objectType": "Order",
  "operation": "UPDATE",
  "previousState": {
    "status": "PENDING",
    "total": 99.99
  },
  "currentState": {
    "status": "COMPLETED",
    "total": 99.99
  },
  "userId": "user-123"
}
```

### Get Change Logs

```http
GET /change-logs
```

Pagination is supported using `page` and `pageSize`:

```http
GET /change-logs?page=1&pageSize=20
```

Example response:

```json
{
  "data": [
    {
      "id": "123",
      "objectId": "order-123",
      "objectType": "Order",
      "operation": "UPDATE",
      "previousState": {
        "status": "PENDING",
        "total": 99.99
      },
      "currentState": {
        "status": "COMPLETED",
        "total": 99.99
      },
      "userId": "user-123",
      "createdAt": "2026-08-01T12:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

## Development Workflow

### 1. Install dependencies

```bash
make install
```

### 2. Start the database

```bash
make db
```

### 3. Start the application

```bash
make app
```

### 4. Run tests

```bash
make test
```

## Make Commands

| Command         | Description                                        |
| --------------- | -------------------------------------------------- |
| `make install`  | Install dependencies and generate Prisma client    |
| `make db`       | Start PostgreSQL and run migrations                |
| `make db-down`  | Stop and remove the development database container |
| `make db-reset` | Completely reset the development database          |
| `make app`      | Generate Prisma client and start the application   |
| `make test`     | Create a fresh test database and run tests         |
| `make studio`   | Open Prisma Studio                                 |

## Database Ports

| Environment |   Port | Database         |
| ----------- | -----: | ---------------- |
| Development | `5433` | `tracevault`     |
| Test        | `5435` | `tracevault_test` |

## Project Structure

```text
.
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── scripts/
│   ├── migrate-test.mjs
│   └── wait-for-db.mjs
├── src/
│   ├── controllers/
│   ├── db/
│   ├── routes/
│   └── app.ts
├── tests/
├── .env.example
├── .gitignore
├── Makefile
├── package.json
└── pnpm-lock.yaml
```
