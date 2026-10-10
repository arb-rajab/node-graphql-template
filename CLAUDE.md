# CLAUDE.md

Notes for Claude Code sessions working in this repo. Keep it factual; add an
item only when it would have saved a round trip.

## Commands

```bash
npm ci && npx prisma generate     # a fresh clone needs both
npm run format:check && npm run lint && npm run typecheck
npm test                          # jest --runInBand, needs PostgreSQL
npm run build
```

## Prisma 7 specifics

- The client is generated into `src/generated/prisma/` (gitignored) and imported
  from `src/generated/prisma/client`. There is no `@prisma/client` import in app
  code and no postinstall hook. After `npm ci`, run `npx prisma generate`, or
  `typecheck`, `test` and `dev` fail with "Cannot find module
  '../generated/prisma/client'". `migrate dev` does not run `generate` either.
- The database URL lives in `prisma.config.ts`, not `schema.prisma`. It reads
  `process.env.DATABASE_URL ?? ''` on purpose: `env()` throws when the variable
  is unset, which breaks `prisma generate` in the Docker build stage and in the
  lint/typecheck CI job. Do not "tidy" it to `env()`.
- The repo is CommonJS. The generator uses `moduleFormat = "cjs"` and
  `importFileExtension = ""`. Do not switch to `"type": "module"`.
- `jest.config.js` overrides ts-jest to emit `module: CommonJS` so the generated
  client's dynamic `import()` becomes `require()`. Without it every test that
  touches the database fails with "A dynamic import callback was invoked
  without --experimental-vm-modules". A per-path transform for only
  `src/generated/**` does not work: ts-jest caches one config per project.
- Keep `prisma`, `@prisma/client` and `@prisma/adapter-pg` on the same version.
  Before bumping, check `npm view <pkg> dist-tags` for all three; a mismatched
  CLI and client fail confusingly.
- `prisma` stays in `dependencies`: the runtime image runs
  `prisma migrate deploy`.

## WebSocket server: do not simplify

`src/graphql/wsServer.ts` deliberately uses `new WebSocketServer({ noServer: true })`
plus a manual `'upgrade'` handler, not `new WebSocketServer({ server: httpServer, path })`.
The simpler form makes `ws` attach its own `httpServer.on('close', ...)` listener
that closes the `WebSocketServer` again after `graphql-ws`'s `dispose()` already
did, which throws on shutdown. It only shows up under test teardown or a real
SIGTERM.

`wsServer.dispose()` must be called exactly once, from the `drainServer` hook of
the plugin inside `apolloServer.stop()` (`src/graphql/apolloServer.ts`). Do not
add a second explicit `dispose()` in a shutdown handler or a test helper.

The upgrade path bypasses Express, so `express-rate-limit` does not cover it;
`wsRateLimiter.ts` does.

## Package versions

- `@apollo/server` v5 has no bundled Express integration. This repo uses
  `@as-integrations/express5`, which needs Express 5.
- `graphql-ws` v6's Node adapter is imported from `graphql-ws/use/ws`. It is only
  reachable through the package `exports` map, so `tsconfig.json` uses
  `module`/`moduleResolution` `Node16`. Do not revert that.
- Check `npm view <pkg> dist-tags` before trusting `latest` for `prisma`: the
  CLI's `latest` tag has pointed at a release candidate while the client's was
  stable.
- `@types/node` must track the Node major used by CI and the Dockerfile (22).
- ts-jest 29.x declares support for jest 29 and 30 in its peer dependencies, and
  there is no ts-jest 30 line. Jest 30 with ts-jest 29.4.x is the supported
  pairing; do not "fix" it by downgrading jest.
- `package.json` `overrides` exist for security fixes. Re-check each on a Prisma
  bump (`npm ls deepmerge-ts mysql2`) and drop an override once Prisma's own pin
  is patched. Do not move `prisma` to devDependencies to quiet `npm audit`.

## Runtime dependencies

The runtime image runs `npm prune --omit=dev`. Anything imported by `src/` must be
in `dependencies`, or `node dist/index.js` crashes at startup with "Cannot find
module" while tests and the build still pass. `pino-pretty` is a devDependency
because it is only loaded when `NODE_ENV=development`.

## Tests

- Always `--runInBand`: `resetDatabase()` truncates shared tables, so parallel
  workers produce flaky failures that look like real bugs.
- A fresh database needs migrations before tests run:
  `DATABASE_URL=... npx prisma migrate deploy`. Otherwise every test file fails
  in `beforeEach`.
- Generate throwaway EC/RSA keys at test time with `crypto.generateKeyPairSync`
  instead of hardcoding PEM strings.

## Environment limits

- Docker is usually unavailable in sandboxes. Trust the `docker` job in
  `.github/workflows/ci.yml` for image build and smoke-test results.
- Never put real third-party credentials in the repo, `.env.example` or CI.

## Placeholders

`project-name` and `project_name` are placeholders replaced by `./rename.sh`.
If `rename.sh` still exists, this project has not been renamed yet.
