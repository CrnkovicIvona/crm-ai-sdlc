# Exploratory QA (BankCRM)

Skill:
[`.cursor/skills/exploratory-qa-expert/SKILL.md`](../../.cursor/skills/exploratory-qa-expert/SKILL.md).

Investigation layer. Not `execute-tests`, not GitHub Actions e2e/
smoke, not the human `IN_QA` gate.

**Unit of work:** a charter session (mission, 2–3 risks, hypotheses,
adaptive exploration, evidence in the EXP file, debrief). Not a
coverage checklist. Success is new information, a confidence change,
a challenged assumption, or unexpected behavior — not a filled table
or “0 bugs”.

**DEEPLY EXPLORED** means meaningful variation or investigation, not
more copies of the same happy path. Hidden UI ≠ authorization
enforcement.

Login-page `test-users` are intended (practice app). `E2E_*` unset is
not an EXP blocker. Do not put passwords in reports.

Default SUT: Production `https://crm-ai-sdlc.vercel.app`. Branch is
source context; do not claim it is what Production runs without
deploy evidence.

Browser: Playwright MCP if connected; otherwise computer-use (or
equivalent). Do not treat a one-off Playwright CLI tour as the
session. GitHub Actions does not run this skill. Do not add
`@playwright/mcp` to the repo.

| Output     | Path                                                      |
| ---------- | --------------------------------------------------------- |
| Session    | [EXP-YYYYMMDD.md](../test-reports/EXP-TEMPLATE.md)        |
| Bugs       | `docs/bugs/` via `manage-bugs`                            |
| CRM polish | `docs/features/CRM-001/ui-ux-proposal.md` as **Proposed** |

No `docs/qa/`. No `src/` from this skill.
