class CookiePage {

  get btnSaveCookies() {
    return cy.get('[data-testid="save-button"]')
  }

  saveCookies(){
    this.btnSaveCookies.should('be.visible').click()
  }
  verifyUrl(){
    cy.url().should('include','/cookies')
  }

}

export default new CookiePage()
