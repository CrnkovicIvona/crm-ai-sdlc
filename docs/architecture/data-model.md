# Data model (relational schema)

Logical/physical schema as shipped in SQL. **Source of truth:
migrations**, not this diagram. Production apply is
`.github/workflows/production-smoke.yml` (SQL on `main`).

Row data (clients, profiles, assignments, audit) is **not** in git.
Only the product catalog is seeded in SQL.

## Migrations

| File                                                                                                                                       | Adds                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| [`supabase/migrations/20260822150000_profiles.sql`](../../supabase/migrations/20260822150000_profiles.sql)                                 | `public.profiles`                                                                      |
| [`supabase/migrations/20260823190000_clients_and_audit.sql`](../../supabase/migrations/20260823190000_clients_and_audit.sql)               | `public.clients`, `public.client_audit_events`, audit trigger                          |
| [`supabase/migrations/20260823210000_products_and_soft_delete.sql`](../../supabase/migrations/20260823210000_products_and_soft_delete.sql) | `deleted_at` / `deleted_by`, `public.products` (6 seed rows), `public.client_products` |

`auth.users` is owned by Supabase Auth (not in our migrations).

Column lists and checks: [../features/CRM-001/implementation-plan.md](../features/CRM-001/implementation-plan.md) §3.

## Entity-relationship diagram

```mermaid
erDiagram
  auth_users ||--|| profiles : "id 1 to 1"
  clients ||--o{ client_products : "has"
  products ||--o{ client_products : "assigned"
  clients ||--o{ client_audit_events : "entity_id no FK"

  auth_users {
    uuid id PK
  }
  profiles {
    uuid id PK
    text role
    timestamptz created_at
    timestamptz updated_at
  }
  clients {
    uuid id PK
    text first_name
    text last_name
    text email
    text phone
    text oib
    timestamptz created_at
    timestamptz deleted_at
    uuid deleted_by
  }
  products {
    uuid id PK
    text code UK
    text name UK
    timestamptz created_at
  }
  client_products {
    uuid client_id PK
    uuid product_id PK
    timestamptz created_at
  }
  client_audit_events {
    uuid id PK
    uuid actor_id
    text action
    text entity
    uuid entity_id
    timestamptz occurred_at
    jsonb previous_value
    jsonb new_value
  }
```

Notes aligned with SQL:

- `profiles.id` references `auth.users(id)` on delete cascade.
- `client_products.client_id` references `clients(id)` on delete cascade.
- `client_products.product_id` references `products(id)`.
- `client_audit_events.entity_id` is the client id at event time.
  **No foreign key**, so history can outlive a hard delete. UI delete
  is soft-delete (`deleted_at`).
- `profiles` is not an FK parent of `clients`. ADMIN/VIEWER is enforced
  by RLS using `profiles.role`.
- Unique active email: `clients_email_lower_key` on `lower(email)`
  where `deleted_at is null`.
- Product seed codes: `bank_account`, `credit_card`, `loan`,
  `savings`, `mobile_banking`, `online_banking`.
