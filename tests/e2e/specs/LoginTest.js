// https://docs.cypress.io/api/introduction/api.html

describe("Login Test", () => {
  it("Visits the app root url", () => {
    cy.visit("http://localhost:8080/");

    cy.get("#input-19")
      .type("alejandro@salesavant.com")
      .should("have.value", "alejandro@salesavant.com");

    cy.get("#input-23")
      .type("qweqwe")
      .should("have.value", "qweqwe");

    cy.get(".btn-primary")
      .click();

    cy.url().should('include', '/home')

    cy.get('.Account').click();

    cy.get('.mainMenu').contains('Logout').click()

    cy.url().should('include', '/')

  });
});
