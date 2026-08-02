# TraceVault

TraceVault is an audit log service for tracking changes made to application objects.

It provides:

* Change log creation and retrieval
* Pagination and object ID search
* Previous and current state tracking
* Change visualization
* Real-time updates using Server-Sent Events (SSE)
* REST API
* React/Vite web interface
* PostgreSQL database
* Docker Compose development environment

## Architecture

```text
                         ┌──────────────────┐
                         │   React / Vite   │
                         │      Web UI      │
                         └────────┬─────────┘
                                  │
                         REST API / SSE
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   Express API    │
                         │                  │
                         │   TraceVault     │
                         └────────┬─────────┘
                                  │
                               Prisma
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   PostgreSQL     │
                         └──────────────────┘
```

## Requirements

* Docker
* Docker Compose
* Node.js
* pnpm

## Getting Started

Install the project dependencies:

```bash
make install
```

Start the complete application stack:

```bash
make compose-up
```

This starts:

* PostgreSQL
* TraceVault API
* TraceVault Web

The application will be available at:

* **Web:** http://localhost:5173
* **API:** http://localhost:3000

## Docker Compose

Start the entire stack:

```bash
make compose-up
```

Stop the stack:

```bash
make compose-down
```

Rebuild the containers:

```bash
docker compose up --build
```

View logs:

```bash
docker compose logs -f
```

View logs for an individual service:

```bash
docker compose logs -f app
docker compose logs -f web
docker compose logs -f db
```

## Frontend

The TraceVault web interface provides a searchable and paginated view of change logs.

Users can:

* Search by object ID
* Browse paginated change logs
* View operation types
* View users and timestamps
* Inspect the previous and current state
* See changes between object states
* Receive new change logs in real time

### Change Log List

<p align="center">
  <img src="docs/tracevault-table.png" width="90%" />
</p>

### Change Log Details

<p align="center">
  <img src="docs/tracevault-details.png" width="90%" />
</p>

## API

### Get Change Logs

```http
GET /change-logs
```

Pagination:

```http
GET /change-logs?page=1&pageSize=20
```

Search by object ID:

```http
GET /change-logs?objectId=785612834
```

Example response:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

### Create Change Log

```http
POST /change-logs
```

Example:

```json
{
  "objectId": "785612834",
  "objectType": "order",
  "operation": "update",
  "previousState": {
    "status": "pending"
  },
  "currentState": {
    "status": "completed"
  },
  "userId": "user-2387"
}
```

### Real-Time Change Log Events

TraceVault uses Server-Sent Events to notify connected clients when a new change log is created.

```http
GET /change-logs/events
```

The server sends events using the `change-log-created` event:

```text
event: change-log-created
data: {...}
```

The frontend can maintain a persistent connection to this endpoint and update the UI whenever a new audit record is created.

## Data Model

Change logs are stored using the following Prisma model:

```prisma
model ChangeLog {
  id            String   @id @default(uuid())
  objectId      String
  objectType    String
  operation     String
  previousState Json?
  currentState  Json
  userId        String?

  createdAt     DateTime @default(now())

  @@index([objectType, objectId])
  @@index([userId])
  @@map("change_logs")
}
```

### Fields

| Field           | Description                                        |
| --------------- | -------------------------------------------------- |
| `id`            | Unique change log identifier                       |
| `objectId`      | ID of the object that changed                      |
| `objectType`    | Type of object that changed                        |
| `operation`     | Operation performed (`create`, `update`, `delete`) |
| `previousState` | Object state before the change                     |
| `currentState`  | Object state after the change                      |
| `userId`        | User responsible for the change                    |
| `createdAt`     | Time the change was recorded                       |

## Change Visualization

For updates, TraceVault compares `previousState` and `currentState` using `jsondiffpatch`.

This allows the UI to show which fields changed rather than requiring users to manually compare two JSON objects.

For example:

```json
{
  "shippingAddress": {
    "city": "Ottawa"
  }
}
```

changing to:

```json
{
  "shippingAddress": {
    "city": "Toronto"
  }
}
```

is represented as a change to:

```text
shippingAddress.city

- Ottawa
+ Toronto
```

## Database

PostgreSQL runs as part of the Docker Compose environment.

Inside Docker, the application connects using:

```text
postgresql://tracevault:tracevault@db:5432/tracevault
```

From the host machine:

```text
postgresql://tracevault:tracevault@localhost:5433/tracevault
```

Run Prisma migrations:

```bash
make migrate
```

Generate the Prisma client:

```bash
make generate
```

Reset the development database:

```bash
make db-reset
```

## Local Development

The application can also be run without Docker.

Start the API:

```bash
make app
```

Start the frontend:

```bash
make web
```

Start PostgreSQL:

```bash
make db
```

Run tests:

```bash
make test
```

## Project Structure

```text
tracevault/
├── prisma/
│   └── schema.prisma
├── scripts/
├── src/
│   ├── api/
│   ├── components/
│   ├── controllers/
│   ├── db/
│   ├── routes/
│   ├── services/
│   ├── web/
│   │   ├── src/
│   │   └── vite.config.ts
│   └── server.ts
├── docs/
│   └── images/
│       ├── changelogs.png
│       └── changelog-details.png
├── Dockerfile
├── docker-compose.yml
├── Makefile
├── package.json
└── pnpm-lock.yaml
```

## Make Commands

| Command             | Description                                     |
| ------------------- | ----------------------------------------------- |
| `make install`      | Install dependencies and generate Prisma client |
| `make compose-up`   | Build and start the complete Docker stack       |
| `make compose-down` | Stop the Docker Compose stack                   |
| `make app`          | Start the API locally                           |
| `make web`          | Start the frontend locally                      |
| `make db`           | Start PostgreSQL                                |
| `make db-down`      | Stop PostgreSQL                                 |
| `make db-reset`     | Reset the PostgreSQL database                   |
| `make generate`     | Generate Prisma client                          |
| `make migrate`      | Run Prisma migrations                           |
| `make test`         | Run the test suite                              |
