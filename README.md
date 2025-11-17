# nestjs-ddd

A Domain-Driven Design (DDD) example project built with NestJS. This repository demonstrates a practical structure and patterns for building scalable, testable, and maintainable backend services using NestJS, TypeScript, and common tools (TypeORM/Prisma, Docker, Swagger, Jest).

Badges
- Build: ![build status](https://img.shields.io/badge/build-passing-brightgreen)
- Coverage: ![coverage](https://img.shields.io/badge/coverage-—%25-lightgrey)
- License: ![license](https://img.shields.io/badge/license-MIT-blue)

Table of contents
- [About](#about)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
  - [Clone](#clone)
  - [Install dependencies](#install-dependencies)
  - [Environment variables](#environment-variables)
  - [Run (development)](#run-development)
  - [Run (production)](#run-production)
- [Architecture / DDD overview](#architecture--ddd-overview)
- [Project structure](#project-structure)
- [Database](#database)
  - [TypeORM](#typeorm)
  - [Prisma](#prisma)
- [API docs / Swagger](#api-docs--swagger)
- [Testing](#testing)
- [Linting & Formatting](#linting--formatting)
- [Docker](#docker)
- [CI / CD](#ci--cd)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Contact](#contact)

About
-----
This repository is a template and reference for building NestJS applications following Domain-Driven Design. It aims to show:
- clear separation between domain, application, infrastructure, and presentation layers
- testable services and use-cases
- recommended patterns for repositories, services, DTOs, and mappers

Features
--------
- NestJS with TypeScript
- Domain-Driven Design folder structure
- Validation with class-validator / class-transformer
- Authentication (JWT) scaffolding
- Persistence examples (TypeORM and Prisma)
- OpenAPI (Swagger) docs
- Unit and e2e testing with Jest
- Docker and docker-compose setup

Tech stack
----------
- Node.js (LTS)
- TypeScript
- NestJS
- PostgreSQL (example)
- TypeORM or Prisma
- Jest (testing)
- ESLint & Prettier
- Docker / docker-compose

Prerequisites
-------------
- Node.js (>= 18 recommended)
- npm or yarn
- Docker (optional for local DB)
- PostgreSQL (or run via Docker)

Getting started
---------------

Clone
```
git clone https://github.com/trungthong2209/nestjs-ddd.git
cd nestjs-ddd
```

Install dependencies
```
# using npm
npm install

# or using yarn
yarn
```

Environment variables
---------------------
Create a `.env` file in the project root (do NOT commit `.env`). Example `.env.example` is provided.

Example `.env`
```
# App
APP_NAME=nestjs-ddd
APP_ENV=development
APP_PORT=3000

# JWT
JWT_SECRET=supersecret
JWT_EXPIRES_IN=3600s

# Database (Postgres example)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=nestjs_ddd

# OR Prisma datasource url
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nestjs_ddd?schema=public
```

Run (development)
-----------------
Start with hot reload:
```
npm run start:dev
# or
yarn start:dev
```

Run (production)
----------------
Build and run:
```
npm run build
npm run start:prod
```

Useful scripts (example)
- start:dev — nest start --watch
- start — nest start
- start:prod — node dist/main.js
- build — tsc -p tsconfig.build.json
- lint — eslint .
- test — jest
- test:e2e — jest --config ./test/jest-e2e.json
- test:cov — jest --coverage
- format — prettier --write .

Architecture / DDD overview
---------------------------
This project follows a layered DDD-inspired architecture:

- domain
  - Entities: core business objects (no framework code, pure TS classes)
  - Value Objects: immutable types for domain invariants
  - Aggregates & Repositories (interfaces): domain contracts
  - Domain Events, Exceptions, and domain logic (business rules)
- application
  - Use Cases / Services: orchestrate domain operations, implement business flows
  - DTOs and mappers for input/output
- infrastructure
  - Database implementations (TypeORM/Prisma) of repository interfaces
  - External integrations (email, queues, etc.)
- presentation
  - NestJS controllers, GraphQL resolvers, pipes, interceptors

This separation enforces testability and keeps domain logic independent of frameworks.

Project structure (example)
---------------------------
- src/
  - main.ts
  - app.module.ts
  - presentation/
    - controllers/
    - dtos/
    - pipes/
  - application/
    - services/
    - use-cases/
  - domain/
    - entities/
    - value-objects/
    - repositories/ (interfaces)
    - exceptions/
  - infrastructure/
    - persistence/
      - typeorm/
      - prisma/
    - services/
  - common/
    - filters/
    - interceptors/
    - guards/
- test/
  - e2e/
- docker-compose.yml
- Dockerfile

Database
--------

TypeORM
- Install: `npm i typeorm @nestjs/typeorm pg`
- Configure TypeOrmModule.forRootAsync(...) using config service and env vars
- Example CLI:
  - Generate migration: `npx typeorm migration:generate -n AddSomething`
  - Run migrations: `npx typeorm migration:run`
- Keep domain entities framework-agnostic when possible (use mapping layers).

Prisma
- Install: `npm i prisma @prisma/client`
- Initialize: `npx prisma init`
- Migrate: `npx prisma migrate dev --name init`
- Generate client: `npx prisma generate`
- Use a PrismaService wrapper to inject PrismaClient into Nest providers.

API docs / Swagger
------------------
Swagger setup (example in src/main.ts):
```ts
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('nestjs-ddd API')
  .setDescription('API documentation')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
```
Visit: `http://localhost:3000/api`.

Testing
-------
- Unit tests with Jest:
```
npm run test
```
- E2E tests (spinning up test DB or using testcontainers):
```
npm run test:e2e
```
- Coverage:
```
npm run test:cov
```
Testing tips:
- Keep domain unit tests independent of DB.
- Use in-memory DB or testcontainers for integration/e2e tests.

Linting & Formatting
--------------------
- ESLint with recommended rules
- Prettier for code formatting

Run:
```
npm run lint
npm run format
```

Docker
------
Example docker-compose.yml (Postgres + app):
```yaml
version: "3.8"
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: nestjs_ddd
    ports:
      - "5432:5432"
    volumes:
      - db-data:/var/lib/postgresql/data

  app:
    build: .
    command: npm run start:prod
    environment:
      - DB_HOST=db
      - DB_PORT=5432
      - DB_USER=postgres
      - DB_PASSWORD=postgres
      - DB_NAME=nestjs_ddd
    ports:
      - "3000:3000"
    depends_on:
      - db

volumes:
  db-data:
```

CI / CD
-------
- Use GitHub Actions for CI: install deps, lint, test, build, and optionally run migrations in a job.
- Use Docker image build and push for CD.

Contributing
------------
- Read CONTRIBUTING.md (if present) for code standards and PR process.
- Run linters and tests before opening PRs.
- Keep PRs small and focused.

Troubleshooting
---------------
- DB connection issues: check `.env`, Docker container logs, and ports.
- Migrations failing: ensure correct TypeORM/Prisma config and matching schema.
- Unexpected type errors: run `npm run build` and inspect TypeScript output.

License
-------
MIT

Contact
-------
Repository owner: trungthong2209
For questions or help, open an issue or contact the owner via GitHub.
