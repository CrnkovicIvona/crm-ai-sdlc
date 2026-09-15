# Exploratory QA (BankCRM)

Cursor skill: [`.cursor/skills/exploratory-qa-expert/SKILL.md`](../../.cursor/skills/exploratory-qa-expert/SKILL.md).

This is an **investigation** layer. It does **not** replace
`execute-tests`, Playwright e2e/smoke in GitHub Actions, or the
human `IN_QA` → `READY_FOR_RELEASE` gate.

## When to invoke

Ask the agent to use `exploratory-qa-expert` against a URL (local
Vite, Preview, or Production `https://crm-ai-sdlc.vercel.app`). Prefer
that origin over unique `*.vercel.app` deployment hostnames.

## Playwright MCP

Live UI uses **Playwright MCP** (`browser_navigate`, `browser_click`,
`browser_type`, `browser_snapshot`, `browser_take_screenshot`,
back/forward, tabs, `browser_console_messages`,
`browser_network_requests`, and related `browser_*` tools).

Enable the Playwright MCP server in **Cursor** (Agent mode). This
repository does not add `@playwright/mcp` to `package.json` and does
not run exploratory sessions as a GitHub Actions job.

If `browser_*` tools are missing, live UI is **BLOCKED**. Do not
invent screenshots.

## What to write

| Output            | Path                                                                                        |
| ----------------- | ------------------------------------------------------------------------------------------- |
| Session report    | `docs/test-reports/EXP-YYYYMMDD.md` from [EXP-TEMPLATE.md](../test-reports/EXP-TEMPLATE.md) |
| Confirmed bugs    | `docs/bugs/BUG-###.md` via `manage-bugs`                                                    |
| CRM screen polish | `docs/features/CRM-001/ui-ux-proposal.md` as **Proposed** only                              |

Do not create `docs/qa/`. Do not edit `src/` from this skill.

## Messy paths

Mandatory. See the skill §15 and the Messy paths section of the EXP
template.

## Example prompt

See skill §39.
