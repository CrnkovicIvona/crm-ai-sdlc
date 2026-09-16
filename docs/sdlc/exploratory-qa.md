# Exploratory QA (BankCRM)

Cursor skill:
[`.cursor/skills/exploratory-qa-expert/SKILL.md`](../../.cursor/skills/exploratory-qa-expert/SKILL.md).

This is an **investigation** layer. It does **not** replace
`execute-tests`, Playwright e2e/smoke in GitHub Actions, or the
human `IN_QA` → `READY_FOR_RELEASE` gate.

BankCRM is a **practice / portfolio** app. The login page
**intentionally** shows ADMIN and VIEWER test identities. Exploratory
sessions use that mechanism. Missing `E2E_*` secrets are **not** a
blocker. Do not report the aside as a security BUG. Do not copy
passwords into EXP reports or git.

## When to invoke

Ask the agent to use `exploratory-qa-expert` against the live
Production origin `https://crm-ai-sdlc.vercel.app`. Prefer that origin
over unique `*.vercel.app` deployment hostnames.

The Git branch is source context. Do not claim Production contains
that branch’s commits unless deploy evidence says so.

Unauthenticated, VIEWER, and ADMIN are all in the default charter,
including **safe** ADMIN writes (prefer a client created in the
session). Production is not read-only. Do not delete or bulk-change
records that are not clearly disposable test data.

Another environment (local Vite, Preview) only if the invocation
explicitly asks and that environment actually exists.

## Playwright MCP

Live UI uses **Playwright MCP** (`browser_*`) when connected.

Enable the Playwright MCP server in **Cursor** (Agent mode). This
repository does not add `@playwright/mcp` to `package.json` and does
not run exploratory sessions as a GitHub Actions job.

If `browser_*` tools are missing, use computer-use (or another
approved browser fallback). That is valid exploration. Record the
tool used. Do not invent screenshots. Do not claim MCP was used if it
was not.

## What to write

| Output            | Path                                                                                        |
| ----------------- | ------------------------------------------------------------------------------------------- |
| Session report    | `docs/test-reports/EXP-YYYYMMDD.md` from [EXP-TEMPLATE.md](../test-reports/EXP-TEMPLATE.md) |
| Confirmed bugs    | `docs/bugs/BUG-###.md` via `manage-bugs`                                                    |
| CRM screen polish | `docs/features/CRM-001/ui-ux-proposal.md` as **Proposed** only                              |

Do not create `docs/qa/`. Do not edit `src/` from this skill.

## Messy paths

Mandatory. See the skill and the Messy Paths section of the EXP
template.

## Example prompt

See skill §48.
