beforeEach(() => {
  cy.login();
});
describe("Created playlist", () => {
  it("Advanced Search", () => {
    cy.visit("/companies");
    cy.get("#button-advanced-search").click();
    cy.get("#field-company-name").type("salesavant");
    cy.get("#button-search-company").click();
    cy.get("#name").should("have.text", "salesavant");
  });
});
