// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import { AUTH_TOKEN } from "../../../src/util.js";
Cypress.Commands.add("login", () => {
  cy.request({
    method: "POST", 
    failOnNetworkError: false,
    url: "http://localhost:4000/auth",
    body: {
      username: "alejandro@salesavant.com",
      password: "qweqwe",
    },
  })
    .its('body')
    .then((resp) => {
      console.log(resp);
      window.localStorage.setItem(AUTH_TOKEN, resp.access_token);
    });
});

Cypress.Commands.add("advancedCompanies", () => {
  cy.visit("/companies");
  cy.get("#button-advanced-search").click();
})
