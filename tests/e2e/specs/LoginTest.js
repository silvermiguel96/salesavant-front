
describe("Login Test", () => {
  it("Visits the app root url", () => {
    cy.visit("http://localhost:8080/home");
    cy.get("#input-19").type("alejandro@salesavant.com");
    cy.get("#input-23").type("qweqwe");
    cy.get("#btn-primary").click();
    cy.url().should('include', '/home');
  });
});
