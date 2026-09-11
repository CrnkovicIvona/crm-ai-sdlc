BankCRM is a **simple multi-layer banking CRM application built for practice and learning**.

The README must give a visitor a complete high-level picture of:

-   what the application does
-   the project's technical complexity
-   its architecture and database
-   the engineering practices demonstrated
-   the skills practiced through the project
-   how development flows from requirement to release
-   how GitHub and GitHub Actions are used
-   how to install and run the application
-   where to find detailed documentation

**README = overview. Repository documentation = details.**

* * *

## 1\. Writing Principles

-   Write in English.
-   Keep the README concise and highly scannable.
-   Use short paragraphs, bullets, tables and diagrams.
-   Prefer links over long explanations.
-   Never duplicate detailed documentation that already exists elsewhere.
-   Never invent information.
-   Use the repository as the source of truth.
-   Describe implemented functionality only.
-   Never expose secrets or credentials.

The README should be understandable within a few minutes.

* * *

## 2\. Inspect Before Updating

Before creating or updating the README, inspect:

-   `src/`
-   `supabase/`
-   `tests/`
-   `docs/`
-   `.github/workflows/`
-   `.cursor/`
-   `package.json`
-   existing README

Identify the actual:

-   features
-   architecture
-   database schema
-   technologies
-   testing approach
-   CI/CD workflows
-   Git workflow
-   project documentation

* * *

## 3\. README Structure

Use this order:

```
# BankCRM

Short description

## Overview
## Features
## Architecture
## Database
## Project Structure
## What This Project Demonstrates
## Development Flow
## Git & GitHub
## CI/CD
## Installation
## How to Run
## Testing
## Documentation
## Security
## License
```

Keep every section concise.

* * *

## 4\. Overview

Immediately state:

-   BankCRM is a simple banking CRM.
-   It is a practice/learning project.
-   It is a multi-layer application.
-   It demonstrates an end-to-end, AI-assisted software development workflow.

Do not write a long introduction.

* * *

## 5\. Features

Show implemented features in a compact list or table.

For every feature that has dedicated documentation:

**link directly to the relevant file.**

Example:

```
| Feature | Description | Documentation |
|---|---|---|
| Authentication | Login, session and roles | [AUTH-001](docs/...) |
| Client Management | Client and product management | [CRM-001](docs/...) |
```

The README should summarize the feature.

The linked documentation should contain the detailed specification, requirements, technical design, test plan, etc.

Never copy the complete specification into README.

* * *

## 6\. Architecture

Show a simple diagram of the actual architecture.

Example:

```
React / Vite SPA
       ↓
Application / Services
       ↓
Supabase Client
       ↓
PostgreSQL + RLS
       ↓
Vercel
```

Adjust this to the actual implementation.

Link to the detailed architecture documentation.

* * *

## 7\. Database

The README MUST contain a concise overview of the actual Supabase/PostgreSQL schema.

Generate it from the current repository schema/migrations and existing data-model documentation.

Include:

-   main tables
-   important relationships
-   relevant roles/access model
-   RLS where applicable

Use a small ER-style diagram or table.

Example:

```
clients
   │
   │ 1:N
   ↓
client_products
```

Then link to:

-   detailed data model documentation
-   relevant migration files
-   relevant RLS specifications

**Do not copy SQL into README.**

The README must describe the schema at a high level only.

* * *

## 8\. Project Structure

Show a small representative tree based on the actual repository.

Example:

```
src/                  Application
supabase/migrations/  Database schema and RLS
tests/                Automated testing
docs/                 Requirements, specs and SDLC
.github/workflows/    CI/CD
.cursor/              Agent rules and skills
```

Link to important directories when useful.

Do not list every file.

* * *

## 9\. What This Project Demonstrates

Include a compact list of skills and engineering practices that are actually demonstrated by the repository.

Examples:

-   Requirements analysis
-   Functional and technical specifications
-   Multi-layer application design
-   Authentication and authorization
-   PostgreSQL / SQL
-   Row Level Security
-   Manual and automated testing
-   API / integration testing
-   E2E testing
-   Test planning
-   Git branching and Pull Requests
-   CI/CD
-   Security checks
-   Agile / SDLC
-   AI-assisted / agentic development
-   Technical documentation

Only include skills supported by actual project evidence.

This section describes **skills demonstrated by the project**, not a personal CV.

* * *

## 10\. Development Flow

Show the project's high-level SDLC:

```
Requirement
    ↓
PO / BA Analysis
    ↓
Specification
    ↓
Test Design
    ↓
Implementation Plan
    ↓
Human Approval
    ↓
Feature Branch
    ↓
Development + Tests
    ↓
Pull Request
    ↓
CI
    ↓
Human QA
    ↓
main
    ↓
Production Verification
```

Link to the canonical SDLC documentation.

Keep the README explanation short.

* * *

## 11\. Git & GitHub

Explain GitHub as the project's collaboration and source-of-truth platform.

Mention, where applicable:

-   Repository
-   Issues
-   Branches
-   Pull Requests
-   Code Review
-   Documentation
-   GitHub Actions

Show the actual branching strategy.

Example:

```
main
├── test
├── release/*
├── feature/*
├── bugfix/*
├── docs/*
└── chore/*
```

Explain each branch in one short sentence.

Do not document the current branch or current branch status.

Link to the detailed Git workflow documentation.

* * *

## 12\. CI/CD

Explain **what each GitHub Actions workflow does and when it runs**.

Use a compact table:

```
| Workflow | Trigger | Purpose |
|---|---|---|
| CI | PR / branch | Quality checks and automated tests |
| Production Smoke | Release / main | Apply production schema and verify production |
| Release Sync | Release merge | Synchronize branches |
```

The exact workflows, triggers and steps MUST be read from `.github/workflows/`.

Also show the execution order when relevant:

```
Pull Request
    ↓
CI
    ↓
Human QA
    ↓
Merge to main
    ↓
Production workflow
    ├── Apply database schema
    └── Production smoke tests
```

Link directly to every workflow file.

Do not document current workflow results.

* * *

## 13\. Installation

Document the actual installation commands from the repository.

Example:

```
git clone <repository-url>
cd <repository>
npm install
```

Document required environment variable names.

Never include secret values.

* * *

## 14\. How to Run

Document the actual commands from `package.json`.

Example:

```
npm run dev
```

Only include commands that actually exist.

* * *

## 15\. Testing

Describe the **testing strategy and available test types**.

Examples:

-   Unit
-   Integration
-   API
-   E2E
-   Smoke
-   Regression

Link to test strategy, plans, cases and relevant test directories.

### Never include execution results

README MUST NOT contain:

-   number of tests
-   passed tests
-   failed tests
-   skipped tests
-   latest test run
-   current coverage
-   current failing tests
-   latest CI result

**Testing section = how testing works.**

**Test reports = what happened during a particular execution.**

* * *

## 16\. Documentation

README should act as a navigation hub.

Link to existing documentation such as:

```
Requirements
Features
Specifications
Architecture
Data Model
Testing
SDLC
Git Workflow
AI / Agent Workflow
Security
Release documentation
```

Use relative links to actual repository files or directories.

**Never invent paths.**

If detailed information exists in a repository file, link to it instead of reproducing it.

* * *

## 17\. Permanent Information Only

README may contain:

-   project purpose
-   implemented features
-   architecture
-   database model
-   project structure
-   engineering practices
-   Git strategy
-   SDLC
-   CI/CD design
-   installation
-   run instructions
-   testing strategy
-   security practices
-   documentation links

README must NOT contain:

-   current branch
-   current branch status
-   current commit
-   current PR
-   current CI status
-   latest test results
-   test counts
-   current coverage
-   current bugs
-   temporary development notes
-   agent execution logs
-   predictions
-   future plans

These belong in Issues, Pull Requests, test reports, release records or dedicated documentation.

* * *

## 18\. Final Validation

Before saving README.md:

-   BankCRM is immediately understandable.
    
-   It is clear that this is a practice project.
    
-   Technical complexity is visible without excessive text.
    
-   Features link to detailed documentation.
    
-   Architecture is summarized and linked.
    
-   Database schema is summarized and linked.
    
-   Project structure is shown.
    
-   Skills and engineering practices are visible.
    
-   Git/GitHub workflow is explained.
    
-   GitHub Actions workflows and execution order are explained.
    
-   Installation and run instructions work.
    
-   Testing strategy is documented.
    
-   No temporary test or branch status exists.
    
-   No invented links or file paths exist.
    
-   README remains concise.
    

## Core Rule

**Give the reader the big picture first.**

Show the complexity, engineering practices and skills demonstrated by BankCRM, then let the reader click into the repository for the details.
