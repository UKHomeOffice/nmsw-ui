import {Given, When, Then} from "@badeball/cypress-cucumber-preprocessor";
import CookieComp from "../../components/cookie.comp";
import CookiePage from "../../pages/cookie.page";

Given('I can see the cookie banner', () => {
  CookieComp.open()
});

When('I click {string} analytics cookies', (handleCookie) => {
  if (handleCookie === 'Accept') {
    CookieComp.acceptCookies()
  } else {
    CookieComp.rejectCookies()
  }
});

Then('an essential cookie is set to store my preference to {string}', (pref) => {
  if (pref === 'track') {
    cy.getCookie('cookiePreference').should('have.property', 'value', 'true')
  } else {
    cy.getCookie('cookiePreference').should('have.property', 'value', 'false')
  }
})

When('I click on the view cookies link', () => {
  CookieComp.viewCookies();
});

Then('I am shown the cookie page', () =>{
  CookiePage.verifyUrl();
})



