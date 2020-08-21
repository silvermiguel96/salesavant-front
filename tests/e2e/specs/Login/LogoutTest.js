
describe("Login Test", () => {
  it("Login", () => {
    cy.visit("http://localhost:8080/home");
    cy.get("#input-19").type("alejandro@salesavant.com");
    cy.get("#input-23").type("qweqwe");
    cy.get("#btn-primary").click();
  });
  it("Logout", () => {
    cy.get('#Account').click();
    cy.get('#mainMenu').contains('Logout').click()
    cy.url().should('include', '/')
  })
});
