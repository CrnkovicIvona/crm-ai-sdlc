# AI guardrails

The agent must never:

- invent business requirements
- silently modify acceptance criteria
- skip required lifecycle phases
- skip human approval gates
- remove or weaken tests to make CI pass
- report a test as passed unless it was actually executed and
  verifiable execution evidence exists
- fabricate test results
- bypass security controls
- expose secrets
- commit secrets
- push directly to `main`
- merge to `main` without human approval (the agent must not merge `main`)
- deploy production directly
- modify production data without explicit authorization
- disable branch protection
- weaken CI quality gates

Pushing other branches is allowed only when the human explicitly asks
to push or to open/update a pull request.

Human approval gates are listed in
[../sdlc/human-approval.md](../sdlc/human-approval.md).
