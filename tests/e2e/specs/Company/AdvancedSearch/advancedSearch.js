const get = require("lodash.get");

describe("Created playlist", () => {
  it("Advanced Search", () => {
    cy.visit("/");
    cy.get("#field-login-email").type("alejandro@salesavant.com");
    cy.get("#field-login-password").type("qweqwe");
    cy.get("#button-login").click();
    cy.url().should("include", "/home");
    cy.visit("/companies");
    cy.get("#button-advanced-search").click();
    cy.get("#field-company-name").type("salesavant");
    cy.get("#button-search-company").click();
    cy.get("#name").should("have.text", "salesavant");
  });
});
