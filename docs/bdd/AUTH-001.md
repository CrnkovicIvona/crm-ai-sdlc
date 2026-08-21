# AUTH-001 BDD

Derived from AUTH-001 acceptance criteria and approved BD-001–BD-007.
Do not invent exact error copy, SSO, or CRM modules.

## US-001 / AC-001, AC-002, AC-008

```gherkin
Feature: Log in to access BankCRM
  Scenario: Authenticated employee can access the CRM
    Given a bank employee is logged in with email and password
    When the employee accesses the CRM
    Then the employee is allowed to access the CRM

  Scenario: Accessing the CRM requires login
    Given a bank employee is not logged in
    When the employee accesses the CRM
    Then the employee is not allowed to access the CRM

  Scenario: Employee authenticates with email and password
    Given a provisioned bank employee
    When the employee logs in with email and password
    Then the employee is authenticated
```

## US-001 / AC-009

```gherkin
Feature: Failed login
  Scenario: Failed authentication is generic
    Given the person is not authenticated
    When the person submits login credentials that are not accepted
    Then a generic authentication failure is shown
    And the outcome does not reveal whether a particular account exists
```

## US-002 / AC-003, AC-010

```gherkin
Feature: Unauthenticated access denied
  Scenario: Person who is not authenticated cannot access the CRM
    Given the person is not authenticated
    When the person accesses the CRM
    Then access to the CRM is denied

  Scenario: Unauthenticated person may use only the login surface
    Given the person is not authenticated
    When the person uses BankCRM
    Then only the login surface is available
```

## US-003 / AC-004, AC-005, AC-011

```gherkin
Feature: ADMIN and VIEWER access
  Scenario: ADMIN has permitted read and write
    Given an authenticated user with role ADMIN
    When the user uses the CRM
    Then the user may perform permitted CRM read operations
    And the user may perform permitted CRM write operations

  Scenario: VIEWER has read-only access
    Given an authenticated user with role VIEWER
    When the user uses the CRM
    Then the user may perform permitted CRM read operations
    And the user must not perform CRM write operations

  Scenario: Employee has exactly one role
    Given a provisioned bank employee
    Then the employee has exactly one application role
    And that role is ADMIN or VIEWER
```

AUTH-001 introduces no CRM resource modules. ADMIN write vs VIEWER
read is the model for future resources (BD-006).

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
    And the employee must authenticate again before CRM access
```
