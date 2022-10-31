Feature: Cookie Page
  I want to accept or reject cookies in the cookie banner

  Background:
    Given I can see the cookie banner

  Scenario: Accept to the  cookie banner
    When I click 'Accept' analytics cookies
    Then an essential cookie is set to store my preference to 'track'

  Scenario: Reject to the cookie banner
    When I click 'Reject' analytics cookies
    Then an essential cookie is set to store my preference to 'do not track'

  Scenario: View the cookie link navigates to cookie page
    When I click on the view cookies link
    Then I am shown the cookie page
