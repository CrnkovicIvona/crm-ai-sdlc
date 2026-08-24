# CRM-001 BDD

- Work item: CRM-001
- Status: DESIGNED (not executed)
- Source: [user-stories.md](user-stories.md)
- Do not invent validation, search matching, or copy.

## US-C001 / AC-C001, AC-C002

```gherkin
Feature: Client entity
  Scenario: Client is the only CRM entity
    Given CRM-001 is in use
    Then the CRM entity available is Client
    And no other CRM entity is provided by CRM-001

  Scenario: Client has the approved fields
    Given a Client record
    Then the Client has first name, last name, email, phone, OIB, and created_at
    And the Client has no additional business fields
```

## US-C002 / AC-C003–AC-C006

```gherkin
Feature: ADMIN Client operations
  Scenario: ADMIN can read Clients
    Given an authenticated user with role ADMIN
    When the user reads Clients
    Then the read is allowed

  Scenario: ADMIN can create a Client
    Given an authenticated user with role ADMIN
    When the user creates a Client with approved fields
    Then the create is allowed

  Scenario: ADMIN can update a Client
    Given an authenticated user with role ADMIN
    And an existing Client
    When the user updates the Client
    Then the update is allowed

  Scenario: ADMIN can delete a Client
    Given an authenticated user with role ADMIN
    And an existing Client
    When the user deletes the Client
    Then the delete is allowed
```

## US-C003 / AC-C007–AC-C011

```gherkin
Feature: VIEWER Client operations
  Scenario: VIEWER can read Clients
    Given an authenticated user with role VIEWER
    When the user reads Clients
    Then the read is allowed

  Scenario: VIEWER can search Clients
    Given an authenticated user with role VIEWER
    When the user searches Clients
    Then the search is allowed

  Scenario: VIEWER cannot create a Client
    Given an authenticated user with role VIEWER
    When the user attempts to create a Client
    Then the create is not allowed

  Scenario: VIEWER cannot update or delete a Client
    Given an authenticated user with role VIEWER
    And an existing Client
    When the user attempts to update or delete the Client
    Then the change is not allowed

  Scenario: VIEWER sees all Client fields
    Given an authenticated user with role VIEWER
    And an existing Client
    When the user reads the Client
    Then all Client fields are visible
```

## US-C004 / AC-C012

```gherkin
Feature: Database authorization boundary
  Scenario: VIEWER cannot change Clients at the data layer
    Given an authenticated user with role VIEWER
    When the user attempts a Client write without using ADMIN UI controls
    Then the write is not allowed by the database authorization boundary
```

## US-C005 / AC-C013–AC-C016, AC-C018, AC-C019

```gherkin
Feature: Client audit trail
  Scenario: Successful create is audited
    Given an authenticated user with role ADMIN
    When the user successfully creates a Client
    Then an audit record exists for that create

  Scenario: Successful update is audited with previous and new values
    Given an authenticated user with role ADMIN
    When the user successfully updates a Client
    Then an audit record exists for that update
    And the record includes previous value and new value

  Scenario: Successful delete is audited
    Given an authenticated user with role ADMIN
    When the user successfully deletes a Client
    Then an audit record exists for that delete

  Scenario: Audit record has required attributes
    Given a successful Client create, update, or delete
    Then the audit record includes actor/user ID, action, entity, entity ID, and timestamp

  Scenario: Read is not audited
    Given an authenticated user
    When the user successfully reads a Client
    Then CRM-001 does not require an audit record for that read

  Scenario: Unauthorized attempt is not audited
    Given an authenticated user with role VIEWER
    When the user attempts to create a Client and is not allowed
    Then CRM-001 does not require an audit record for that attempt
```

## US-C006 / AC-C017

```gherkin
Feature: Append-only audit
  Scenario: Users cannot change audit records in the CRM application
    Given an authenticated user with role ADMIN
    When the user uses the CRM application
    Then the user cannot modify audit records
    And the user cannot delete audit records
```

## US-C007 / AC-C020–AC-C022

```gherkin
Feature: Products and soft-delete
  Scenario: Catalog is fixed
    Given CRM-001 is in use
    Then six English catalog products are available
    And no Product administration module is provided

  Scenario: Products are optional
    Given an authenticated user with role ADMIN
    When the user creates a Client without selecting a product
    Then the create is allowed
    And the Client shows No products assigned.

  Scenario: Soft-delete hides the Client
    Given an authenticated user with role ADMIN
    And an existing Client
    When the user confirms delete
    Then the Client is not in the active list
    And restore is not offered
```
