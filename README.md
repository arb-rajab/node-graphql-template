# project-name

Starter template for a GraphQL + WebSocket API: Express 5, Apollo Server 5,
`graphql-ws` subscriptions, Prisma 7 on PostgreSQL, JWT auth, Jest tests.

## What is included

- `src/app.ts`: Express app with Helmet, CORS, a rate-limited `/graphql`
  endpoint and an unauthenticated `/healthz`.
- `src/index.ts`: server bootstrap and graceful shutdown on SIGTERM/SIGINT.
- `src/config/env.ts`: environment validated with Zod; fails fast on bad config.
- `src/auth/`: JWT sign/verify, bcrypt password hashing, bearer-token and
  WebSocket connection-param extraction.
- `src/graphql/`: schema assembly, context, Apollo server, WebSocket server
  with an upgrade rate limiter and connection cap, in-process PubSub.
- `src/graphql/typeDefs/user.ts` + `resolvers/user.ts` + `services/userService.ts`:
  `register`, `login` and `me`.
- `src/graphql/typeDefs/echo.ts`: a tiny authenticated mutation + subscription
  pair that exercises the WebSocket path. Replace it with your first module.
- `prisma/`: schema with a `User` model and the initial migration.
- `tests/`: unit tests, and integration tests against a real PostgreSQL.
- Dockerfile (multi-stage, non-root), `docker-compose.yml` (PostgreSQL + API),
  GitHub Actions for CI, CodeQL and security scans, Dependabot.

## Start a new project from this template

```bash
./rename.sh my-service        # replaces project-name / project_name, then deletes itself
cp .env.example .env          # set JWT_SECRET: openssl rand -base64 48
npm install                   # refreshes package-lock.json for the new name
```

Then edit `LICENSE` (year and holder), `SECURITY.md` and
`docs/project-memory/01-brief.md`.

## Develop

```bash
docker compose up -d postgres       # or any local PostgreSQL 16
npm ci
npx prisma generate                 # the client is generated into src/generated, not installed
npx prisma migrate deploy           # apply migrations to DATABASE_URL
npm run dev                         # http://localhost:4000/graphql
```

Checks (the same ones CI runs):

```bash
npm run format:check && npm run lint && npm run typecheck
npm test                            # needs PostgreSQL; see "Tests" below
npm run build
```

### Tests

`npm test` runs Jest with `--runInBand` because the integration tests share one
database. `tests/setup/env.ts` defaults `DATABASE_URL` to
`postgresql://project_name:project_name_dev_pw@localhost:5432/project_name_test`.
Create that role and database, then apply migrations to it:

```bash
sudo -u postgres psql -c "CREATE USER project_name WITH PASSWORD 'project_name_dev_pw' CREATEDB;"
sudo -u postgres psql -c "CREATE DATABASE project_name_test OWNER project_name;"
DATABASE_URL='postgresql://project_name:project_name_dev_pw@localhost:5432/project_name_test?schema=public' \
  npx prisma migrate deploy
```

## Optional pieces

- **WebSockets / subscriptions**: delete `src/graphql/wsServer.ts`,
  `wsRateLimiter.ts`, `pubsub.ts`, the `echo` module and the related tests if
  you only need request/response GraphQL. Remove the `drainServer` plugin and
  the `wsServer` argument in `apolloServer.ts`, `index.ts` and
  `tests/setup/testServer.ts`.
- **Distributed PubSub**: `pubsub.ts` is in-process. Swap in a Redis-backed
  implementation before running more than one instance.

## Project memory

`docs/project-memory/` holds project documentation stubs (brief, requirements,
architecture, decisions and so on). `./scaffold-memory-pack.sh` recreates any
missing file without overwriting existing ones.

## Security

See `SECURITY.md`. CI runs gitleaks, `npm audit`, osv-scanner and CodeQL.
Dated dependency exemptions go in `osv-scanner.toml`.

The pull-request job "Dependency review (PR diff)" needs GitHub's **dependency graph** turned
on for the repository (Settings, Code security). Without it the job fails with "Dependency
review is not supported on this repository". It is on by default for public repositories but
can be off in repositories created from this template, so check it once after creating yours.
