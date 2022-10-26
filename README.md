# Secure API Nest JS

Dependencies installed so far:

- `npm i --save @nestjs/typeorm typeorm pg` for ORM mapping using Postgresql.
- `npm i --save @nestjs/config` for environment configuration.
- `npm i --save class-validator class-transformer` for Validations.
- `npm i --save keycloak-connect` to use Keycloak.
- `npm i --save nest-keycloak-connect` to use Keycloak.
- `npm i --save-dev @faker-js/faker` to generate test data.
- `npm i --save nestjs-i18n` to add support for localization.

## Directory Structure

- `/src/` - The Typescript code.
- `/test` - The Typescript test code.
- `/src/docker`: The Docker files to build the Keycloak and PostgreSQL Docker images for dev purposes.
- `/src/postman`: Postman files to import collection and local test environment variables.

## Running tests

The tests mock the repositories and security (guards), so, there is no need for any container to run tests:

```bash
npm run test
```

To run a specific file:
```bash
npm run test test/controllers/customer.controller.spec.ts
```

## Run the application in dev mode

### Start the Keycloak and PostgreSQL services  

This application depends on these services, so, you must have them running.

1. Make a copy of the `docker/.env.example` file to `docker/.env`. PS: The `docker/.env` should never be versioned.

2. You can run the bash script `./start-keycloak.sh` to start Docker containers. The content of the script is below:
```bash
docker-compose -f docker/docker-compose.yaml --env-file=docker/.env build
docker-compose -f docker/docker-compose.yaml --env-file=docker/.env up -d
docker-compose -f docker/docker-compose.yaml --env-file=docker/.env logs -f
```

The Keycloak will be available at `http://localhost:8080`.

To stop the containers you can run the script `./stop-keycloak.sh`. The content of the script is shown below:
```bash
docker-compose -f docker/docker-compose.yaml --env-file=docker/.env down
```

### Create a Keycloak Realm

1. To complete the setup of Keycloak, you also need to configure a Realm to test the application.

[Configure a new realm](./docs/create-new-realm-keycloak-18.pdf).

2. Open the `.env` and replace the following properties:

  - `KEYCLOAK_CLIENT_SECRET` with the value from Keycloak Secret (Realm App -> Menu Clients -> Tab Credentials).

  - `KEYCLOAK_REALM_PUBLIC_KEY` with the value from Keycloak Secret (Realm App -> Menu Realm Settings -> Tab Keys -> Tab Active -> Row RS256 -> Click on the button Public Key of the public keys column).

## Run the migrations to initialize the database

Build the project:
```bash
npm run build
```

Command to run the migrations:
```bash
npm run typeorm migration:run -- -d ./dist/typeOrm.config.js
```

## Start the application

Finally, it's possible to run the application:
```bash
npm run start:dev
```
