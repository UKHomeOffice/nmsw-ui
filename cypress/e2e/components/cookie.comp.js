class CookieComponent {

  // Getters for page locators
  get btnAcceptCookies() {
    return cy.contains('Accept analytics cookies')
  }

  get btnRejectCookies() {
    return cy.contains('Reject analytics cookies')
  }

  get btnHideCookieMsg() {
    return cy.contains('Hide cookie message')
  }

  get lnkViewCookies() {
    return cy.get('[href="/cookies"][class="govuk-link"]')
  }

  //Re-usable methods

  /**
   * Function to Accept Cookies
   */
  acceptCookies() {
    this.btnAcceptCookies.should('be.visible').click()
    this.btnHideCookieMsg.should('be.visible').click()
  }

  /**
   * Function to Reject Cookies
   */
  rejectCookies() {
    this.btnRejectCookies.should('be.visible').click()
    this.btnHideCookieMsg.should('be.visible').click()
  }

  /**
   * Function to view Cookies
   */
  viewCookies() {
    this.lnkViewCookies.should('be.visible').click();
  }

  /**
   * To open the url
   */
  open() {
    cy.visit('/')
  }

}

export default new CookieComponent()
