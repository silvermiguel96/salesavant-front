beforeEach(() => {
  cy.login();
});
describe("Created playlist", () => {
  it("Advanced Search", () => {
    cy.advancedCompanies();
    cy.get("#field-company-name").type("salesavant");
    cy.get("#field-company-state").type("Florida");
    cy.get("#field-company-country").type("Alabama");
    cy.get("#button-search-company").click();
    cy.get("#name").should("have.text", "salesavant");
    cy.get("#state").should("have.text", "Florida");
    cy.get("#country").should("have.text", "Alabama");
  });
});
