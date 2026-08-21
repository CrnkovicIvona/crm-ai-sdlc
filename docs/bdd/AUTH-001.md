# AUTH-001 BDD

Derived only from AUTH-001 acceptance criteria. Login _method_ is
**TBD (human)**; scenarios use “logged in” / “not authenticated”
without inventing credentials, SSO, or error copy.

## US-001 / AC-001, AC-002

```gherkin
Feature: Log in to access BankCRM
  Scenario: Authenticated employee can access the CRM
    Given a bank employee is logged in
    When the employee accesses the CRM
    Then the employee is allowed to access the CRM

  Scenario: Accessing the CRM requires login
    Given a bank employee is not logged in
    When the employee accesses the CRM
    Then the employee is not allowed to access the CRM
```

## US-002 / AC-003

```gherkin
Feature: Unauthenticated access denied
  Scenario: Person who is not authenticated cannot access the CRM
    Given the person is not authenticated
    When the person accesses the CRM
    Then access to the CRM is denied
```

## US-003 / AC-004, AC-005

```gherkin
Feature: ADMIN and VIEWER access
  Scenario: ADMIN has full access
    Given an authenticated user with role ADMIN
    When the user uses the CRM
    Then the user has full access to the CRM

  Scenario: VIEWER has read-only access
    Given an authenticated user with role VIEWER
    When the user uses the CRM
    Then the user has read-only access to the CRM
```

Observable meaning of “full” vs “read-only” remains **TBD (human)**
until other CRM capabilities are specified.

## US-004 / AC-006, AC-007

```gherkin
Feature: Log out
  Scenario: Authenticated user can log out
    Given an authenticated bank employee
    When the employee logs out
    Then the employee is no longer authenticated

  Scenario: After logout CRM access is denied
    Given an authenticated bank employee has logged out
    When the employee accesses the CRM
    Then access to the CRM is denied
```
