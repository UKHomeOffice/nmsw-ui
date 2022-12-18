class CookiePage {

  get btnRadioYes() {
    return cy.get('input[type="radio"][value="yes"]');
  }

  get btnRadioNo() {
    return cy.get('input[type="radio"][value="no"]');
  }

  get formManageCookie() {
    return cy.get('#changeYourCookieSettings');
  }

  get btnSaveCookies() {
    return cy.get('[data-testid="submit-button"]');
  }

  get bannerSuccess() {
    return cy.get('#govuk-notification-banner-title');
  }

  get bnrSuccessMsg() {
    return cy.get('.govuk-notification-banner__content');
  }

  //Re-usable methods
  clickSaveCookies() {
    this.btnSaveCookies.should('be.visible').click();
  }

  checkBtnRadioYes() {
    this.btnRadioYes.scrollIntoView().should('be.checked');
    this.btnRadioNo.scrollIntoView().should('not.be.checked');
  }

  clickBtnRadioYes() {
    this.btnRadioYes.check('yes');
  }

  checkBtnRadioNo() {
    this.btnRadioNo.scrollIntoView().should('be.checked');
    this.btnRadioYes.scrollIntoView().should('not.be.checked');
  }

  clickBtnRadioNo() {
    this.btnRadioNo.check('no');
  }

  checkFormManageCookie() {
    this.formManageCookie.scrollIntoView().should('be.visible');
  }

  verifyBannerSuccess() {
    this.bannerSuccess.should('have.text', 'Success');
  }

  verifyBnrSuccessMsg() {
    this.bnrSuccessMsg.should('have.text', 'You\'ve set your cookie preferences.');
  }

  verifyUrl() {
    cy.url().should('include', '/cookies');
    cy.injectAxe();
  }

}

export default new CookiePage();
