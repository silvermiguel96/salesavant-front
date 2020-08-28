beforeEach(() => {
  cy.login();
});
describe("Login Test", () => {
  it("Logout", () => {
    cy.visit("/home")
    cy.get('#Account').click();
    cy.get('#mainMenu').contains('Logout').click()
    cy.url().should('include', '/')
  })
});
