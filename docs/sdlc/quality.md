# Quality strategy

## Now

- Prettier (`npm run format:check`)
- Conventional Commits (commitlint on pull requests)
- gitleaks in CI
- EditorConfig

## When application source exists

- ESLint required in CI (see [testing-strategy.md](testing-strategy.md))
- Vitest unit and integration required per test plan
- Playwright e2e required per test plan and risk
- Do not weaken or skip these jobs to obtain a green build

## Agent

Do not add `continue-on-error: true` to required workflows. Do not
delete assertions to pass CI.
