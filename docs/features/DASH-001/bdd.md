# DASH-001 BDD

- Work item: DASH-001
- Status: DESIGNED (not executed)
- Source: [user-stories.md](user-stories.md)

```gherkin
Feature: CRM dashboard
  As an authenticated bank employee
  I want a read-only dashboard
  So that I can see defined CRM metrics without changing data

  Scenario: AC-D001 ADMIN or VIEWER opens dashboard
    Given I am authenticated as ADMIN or VIEWER
    When I open /app/dashboard
    Then I see dashboard KPIs
    And I do not see client write controls

  Scenario: AC-D002 unauthenticated
    Given I am not authenticated
    When I request /app/dashboard
    Then I am handled as AUTH-001 unauthenticated access
    And I do not see dashboard KPIs

  Scenario: AC-D003 Active Clients current stock
    Given 10 clients exist and 2 are soft-deleted
    Then Active Clients is 8
    And changing the date range does not change Active Clients

  Scenario: AC-D004 New Clients include in-period deletions
    Given a client created inside the selected period
    And that client is later soft-deleted in the same period
    Then New Clients still includes that client

  Scenario: AC-D005 Churned Clients by deleted_at
    Given clients with deleted_at inside and outside the period
    Then only inside-period deleted_at values count as Churned Clients

  Scenario: AC-D006 Churn Rate five percent
    Given opening active base is 100
    And 5 clients churn in the period
    Then Churn Rate is 5%

  Scenario: AC-D007 Churn Rate N/A when opening base is zero
    Given opening active base is 0
    And churned clients is 0
    Then Churn Rate is N/A
    Given opening active base is 0
    And churned clients is greater than 0
    Then Churn Rate is N/A

  Scenario: AC-D008 Net Client Growth
    Given New Clients is 18
    And Churned Clients is 4
    Then Net Client Growth is 14

  Scenario: AC-D009 Last 30 days mapping
    Given Last 30 days is selected
    Then New Clients uses created_at in the period
    And Churned Clients uses deleted_at in the period
    And Churn Rate uses opening base
    And Active Clients remains current stock

  Scenario: AC-D010 Product Adoption Rate
    Given 100 active clients
    And 60 have at least one product
    Then Product Adoption Rate is 60%

  Scenario: AC-D011 Distinct per product
    Given one active client has three products
    Then each of those three products has that client counted once

  Scenario: AC-D012 Deleted client products ignored
    Given a soft-deleted client has product assignments
    Then those assignments do not affect adoption or by-product KPIs

  Scenario: AC-D013 Empty state
    Given there are no active clients
    Then the dashboard does not display NaN, Infinity, or undefined
```
