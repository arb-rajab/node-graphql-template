# Dependabot status

_Last updated: 2026-10-10. Starter template extracted from `notifyhub`; update when the state changes._

## Configuration

- Ecosystems covered: npm (`/`), docker (`/`), docker-compose (`/`), github-actions (`/`).
- Grouping: npm development dependencies grouped as `dev-dependencies`.
- Schedule: weekly.
- Ignore rules: `typescript` and `@types/node` majors; Docker `node` 25.x (non-LTS); docker-compose image majors.

## State at last update

- Open Dependabot PRs: 0 (each merged or closed only after reading its checks).
- Default-branch CI: green at last check.
- Repository settings (read live 2026-10-10): public, `is_template` true, description set, default branch `main` (the only branch kept), secret scanning, push protection and Dependabot security updates enabled, dependency graph on (SBOM endpoint 200). Non-provider secret patterns and validity checks stay off: GitHub does not offer them on this user-owned public repo.
- Set by the repo owner through the API on 2026-10-10 (the session's proxy blocks repository-settings writes) and read back by the session the same day: private vulnerability reporting enabled (PUT 204), `delete_branch_on_merge` on (PATCH 200), repository topics set (PUT 200). Fork-PR workflow approval is `all_external_contributors` (read with the owner's token). Stale branches left over from squash-merged PRs were deleted after a fresh diff against `main` showed their content already on `main`.
- Alerts read 2026-10-10 with the repo owner's token: Dependabot #1 `sprintf-js` (GHSA-hp3w-g68c-fv3c, medium, no patched release, dev-only) matches the `osv-scanner.toml` exemption; proposed for dismissal as `tolerable_risk` until 2026-11-09. Code scanning #1 `js/cors-permissive-configuration` (`src/app.ts:28`) flags the literal `*` origin, the same finding notifyhub dismissed as a false positive: credentials are never allowed and auth is the `Authorization` header, so a cross-origin page gains nothing. Proposed for dismissal as `false positive`. No secret-scanning alerts.

## Time-limited exemptions

- `osv-scanner.toml`, every entry expiring 2026-11-09 (earlier than the source repos' 2026-11-15): `sprintf-js` GHSA-hp3w-g68c-fv3c (dev tooling, never shipped). After that date the scan fails until each entry is renewed or removed. The scan is not a required check, so merges still work, but re-check each advisory for a fix before then.

## Notes

- Merge policy (deliberate choice by the repo owner, the same blanket policy as the application repos): every PR, major-version dependency bumps included, is squash-merged as soon as all of its required checks are green, confirmed per PR. This repo is a code showcase with no business or sensitive dependency, so green checks are the only gate. Red, pending or conflicted PRs are fixed or closed instead.
- `main` protection (2026-10-10, read back): pull request required (0 approvals), enforced for admins, force pushes and deletions blocked, "require branches to be up to date" off (`strict` false) on purpose. Nobody pushes to `main` directly; status-log updates go through a PR too.
- Required contexts: `Lint & typecheck`, `Test & build`, `Docker build`, `Secret scan (gitleaks)`. Nothing else is required on purpose: osv-scanner, npm audit, dependency review and CodeQL depend on a moving advisory database or run only on some events.
- Closed unmerged on 2026-10-10, each with an explanatory comment: #1 (`graphql` 17), #2 (`graphql-scalars` 2, needs graphql 17), #3 (`express-rate-limit` 8), #4 (`helmet` 8) and #5 (`node` 25, non-LTS). If Dependabot recreates one, apply the merge policy; the closure is not re-raised. Dependabot does not re-propose a major after its PR is closed, so a later upgrade is a manual change.
- `Dependency review (PR diff)` passed on #6 once the dependency graph was on.

## Deferred (not re-raised each pass)

- Alert reads (Dependabot, code scanning, secret scanning) and Actions settings (fork-PR approval) are blocked for Claude sessions by the proxy; they are read and written with the repo owner's token on their own machine.
- The owner keeps the token's Administration, Contents and Secret scanning permissions and does not rotate it (deliberate, 2026-10-09, reconfirmed 2026-10-10 for the template repos).
- Re-check the exemptions above before 2026-11-09 and drop each once its upstream fix ships.
