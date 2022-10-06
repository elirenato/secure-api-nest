# Secure API Nest JS

In progress...

Dependencies installed so far:

- `npm i --save @nestjs/typeorm typeorm pg` for ORM mapping using Postgresql.
- `npm i --save @nestjs/config` for environment configuration.
- `npm i --save class-validator class-transformer` for Validations.
- `npm i --save keycloak-connect` to use Keycloak.
- `npm i --save nest-keycloak-connect` to use Keycloak.
- `npm i --save-dev @faker-js/faker` to generate test data.
- `npm i --save nestjs-i18n` to add support for localization.

## Directory Structure

This project follows the default Java structure `/src/main`.

- `/src/` - The Typescript code.
- `/test` - The Typescript test code.
- `/src/main/docker`: The Docker files to build the Keycloak and PostgreSQL Docker images for dev purpose.
- `/src/main/jenkins` - Jenkins file and resources that are used to set up the pipeline to build and deploy the application.

## Running tests

The tests mock the repositories and security (guards), so, there is no need any container to run tests:

`npm run test`

To run a specific file:
`npm run test test/customers/customer.controller.spec.ts`

## Before run the application in dev mode

### Keycloak and PostgreSQL  

This application depend on these services, so, you must have them running.

1. Make a copy of the `docker/.env.example` file to `docker/.env`. PS: The `docker/.env` should not never be versioned.

2. You can run the bash script `./start-keycloak.sh` to start Docker containers. The content of the script is below:
```bash
docker-compose -f docker/docker-compose.yaml --env-file=docker/.env build
docker-compose -f docker/docker-compose.yaml --env-file=docker/.env up -d
docker-compose -f docker/docker-compose.yaml --env-file=docker/.env logs -f
```

The Keycloak will be available at `http://localhost:8080`.

To stop the containers you can run the script `./stop-keycloak.sh`. The content of the script is show below:
```bash
docker-compose -f docker/docker-compose.yaml --env-file=docker/.env down
```

### Keycloak Realm

1. To complete the setup of Keycloak, you also need to configure a Realm to test the application.

[Configure a new realm](https://elibarbosa.dev/using-keycloak-to-secure-applications/#configure-realm).

2. Make a copy of the `.keycloak.json.example` file to `.keycloak.json`.

3. Open the `.keycloak.json` and replace the following properties:

  - `secret` with the value from Keycloak Secret (Realm App -> Menu Clients -> Tab Credentials).

  - `realmPublicKey` with the value from Keycloak Secret (Realm App -> Menu Realm Settings -> Tab Keys -> Tab Active -> Row RS256 -> Click on the button Public Key of the public keys column).

Example:
```json
{
  "authServerUrl": "http://localhost:8080/auth",
  "realm": "app",
  "clientId": "secure-api",
  "secret": "mH05hDdoTgEu5qDYWlaZRXuHx6LiVjxs",
  "public": false,
  "tokenValidation": "online",
  "realmPublicKey": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsrHiT8EMhoOEDjP3lXv3LygVCUXXZJF08rxXG79QG1iOEwHqLz8N1pHNoa1yZybLiifwzDOGQiiB6NGgx4M6gLXKoGO8fAydbC0W0qmaiqljNXht6JdzNWZ2/cJ0MtYxbJJy9y+BFEfUtMXJCPpnn+t7t2ZlS6ceaVVuPHjPpnx9ClgfG9WYoebbN2Grv0rEoIzo2dFQHNShZxcGA2+bV4K/JuLp0Vb26euSFhBJCxuzUIk3jSU8i6MFNTaTZbmvcA46YgKa7mvlX22i4lGwE9GKy5MznMG3o3uyaxJhTRJQpsdy3D9gH/ECL84s/gI0hcIpFj253yibSm5y/E1p/wIDAQAB"
}
```

PS: The `.keycloak.json` should not never be versioned.

### Run the application in dev mode

Finally, it's possible to run the application:
```bash
npm run start:dev
```

