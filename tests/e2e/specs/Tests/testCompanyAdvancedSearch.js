describe("Login Test", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("http://localhost:8080/companies");
  });
  it("Go to Companies", () => {
    // cy.visit("http://localhost:8080/home");
    // cy.get("#input-19").type("alejandro@salesavant.com");
    // cy.get("#input-23").type("qweqwe");
    // cy.get("#btn-primary").click();
    cy.visit("http://localhost:8080/companies");

    // cy.get(".v-toolbar__content").contains(
    //   "v-toolbar__items hidden-sm-and-down"
    // );

    // it("", () => {
    //   // cy.visit("http://localhost:8080/home");
    //   // cy.get('#mainMenu').contains('Logout').click()
    //   // cy.url().should('include', '/')
    // });
    // cy.visit("http://localhost:8080/");
    // cy.login();
  });
});
