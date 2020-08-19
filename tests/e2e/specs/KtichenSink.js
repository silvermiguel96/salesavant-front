// https://docs.cypress.io/api/introduction/api.html

describe("Testing APP Cypress", () => {
  it("Visits the app root url", () => {
    cy.visit("https://example.cypress.io/");

    cy.contains('type')

    cy.contains('type').click()
    
    cy.url().should('include', '/commands/actions')
     
  });
});
