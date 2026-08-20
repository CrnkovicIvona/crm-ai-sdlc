# Commits

Use [Conventional Commits](https://www.conventionalcommits.org/).

## Format

```
<type>(<scope>): <description>
```

`scope` is the work item ID when one exists (`ENG-001`, `AUTH-001`).

## Types

`feat`, `fix`, `docs`, `test`, `chore`, `ci`, `refactor`, `style`, `perf`, `build`, `revert`

## Examples

```
feat(AUTH-001): implement user login
test(AUTH-001): add login e2e tests
fix(AUTH-001): handle invalid credentials
docs(AUTH-001): add login test plan
chore(ENG-001): establish project foundation for AI-assisted SDLC
```

## Rules

- Imperative mood, no trailing period required
- Do not include secrets in commit messages
- commitlint runs on pull requests
- Do not rewrite history on `test` or `main`
