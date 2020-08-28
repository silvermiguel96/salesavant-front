
describe("Login Test", () => {
  it("Visits the app root url", () => {
    cy.visit("http://localhost:8080/home");
    cy.get("#field-login-email").type("alejandro@salesavant.com");
    cy.get("#field-login-password").type("qweqwe");   
    cy.get("#button-login").click();
    cy.url().should('include', '/home');
  });
});
