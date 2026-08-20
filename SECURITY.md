# Security Policy

## Reporting a vulnerability

Do not file a public GitHub Issue for vulnerabilities that could expose
customer data, credentials, or a path to unauthorized access.

Email the maintainer listed on the GitHub repository (currently
CrnkovicIvona) and include:

- a description of the issue
- steps to reproduce (privately)
- impact assessment
- whether production data or secrets may be involved

You should receive an acknowledgement. Do not disclose the issue publicly
until the maintainer confirms a fix or coordinated disclosure plan.

## Secrets

Never commit secrets, API keys, service-role keys, or production connection
strings. Use GitHub, Vercel, and Supabase secret stores when those platforms
are connected.

The AI agent must never:

- commit secrets
- paste secrets into issues, pull requests, logs, or docs
- disable secret scanning
- bypass authentication or authorization controls
- modify production data without explicit human authorization

## Scope of this repository (current phase)

This repository currently contains process, documentation, and tooling
foundation only. There is no application runtime, database schema, or
production deployment configuration yet.
