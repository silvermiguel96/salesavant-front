
beforeEach(() => {
  cy.login();
});
describe("Created playlist", () => {
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
    cy.get("#button-open-signal").click();
    cy.get("#input-208").type("Test cypress  Signal");
    cy.get("#input-211").type("Description cypress salesavant");
    cy.get("#input-214").type("10");
    cy.get("#input-217").type("Group Test ");
    cy.get("#saveSignal").click();
  });
});
