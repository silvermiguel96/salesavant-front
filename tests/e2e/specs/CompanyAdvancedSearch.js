
describe("Login Test", () => {
  it("Advanced Search", () => {
    cy.visit("http://localhost:8080/home");
    cy.get("#input-19").type("alejandro@salesavant.com");
    cy.get("#input-23").type("qweqwe");
    cy.get("#btn-primary").click();
    cy.url().should('include', '/home');
    cy.visit("http://localhost:8080/companies");
    cy.get("#btnAdvancedSearch").click();
    cy.get("#input-83").type("salesavant");
    cy.get("#btnSearch").click();

  });
});
