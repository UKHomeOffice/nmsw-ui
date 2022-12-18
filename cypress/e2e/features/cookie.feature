Feature: Cookie Page
  I want to accept or reject cookies in the cookie banner

  Background:
    Given I can see the cookie banner

  Scenario Outline: Accept or Reject the  cookie banner
    When I click '<cookie>' analytics cookies
    Then an essential cookie is set to store my preference to '<preference>'
    Then the cookie banner is not visible
    Then the confirmation banner is shown
    When I click on the 'change your cookie settings' link
    Then I am shown the cookie page
    Then I am provided a form to manage my preferences
    Then the form should be set to '<status>'
    When I change my cookie preference to '<changeStatus>' and click save
    Then my '<newPreference>' for analytics cookies should be saved
    Then I am shown a success banner

    Examples:
      | cookie | preference   | status | changeStatus | newPreference
      | Accept | track        | Yes    | No           | No
      | Reject | do not track | No     | Yes          | Yes


  Scenario: View the cookie link navigates to cookie page
    When I click on the view cookies link
    Then I am shown the cookie page
    Then the form should be set to no

  Scenario Outline: Accept or Reject and view cookie page
    When I click '<cookie>' analytics cookies
    When I click on the view cookies link
    When I click hide cookie message
    Then I can no longer see the cookie banner
    Then the form should be set to '<status>'
    Examples:
      | cookie | status |
      | Accept | Yes    |
      | Reject | No     |
