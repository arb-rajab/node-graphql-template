# Dependabot status

_Last updated: 2026-10-11. Starter template extracted from `notifyhub`; update when the state changes._

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
- Alerts read 2026-10-10 with the repo owner's token: Dependabot #1 `sprintf-js` (GHSA-hp3w-g68c-fv3c, medium, no patched release, dev-only) matches the `osv-scanner.toml` exemption; dismissed as `tolerable_risk` with a comment by the repo owner on 2026-10-10 (PATCH 200); re-check before 2026-11-09. Code scanning #1 `js/cors-permissive-configuration` (`src/app.ts:28`) flags the literal `*` origin, the same finding notifyhub dismissed as a false positive: credentials are never allowed and auth is the `Authorization` header, so a cross-origin page gains nothing. Dismissed as `false positive` with a comment by the repo owner on 2026-10-10 (PATCH 200). No secret-scanning alerts. The read-back after the dismissals showed 0 open Dependabot and 0 open code-scanning alerts.
- Rescan 2026-10-11 repeated every dimension (open PRs, branches, CI on `main`, required contexts against the last merged PR's check runs, protection, `security_and_analysis`, private vulnerability reporting, dependency graph, `is_template`, description, topics, licence placeholders) and added one: whether the GitHub description actually describes this repo. Live result: no open PRs, `main` the only branch, CI on `main` green, every required context produced green by the last merged PR, protection unchanged, secret scanning, push protection and Dependabot security updates enabled, private vulnerability reporting on, SBOM 200, `is_template` true, description accurate, topics set, `LICENSE` filled in (2026, arb-rajab). The repo owner's token read 0 open Dependabot, code-scanning and secret-scanning alerts and fork-PR approval `all_external_contributors`. No new gaps.

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
