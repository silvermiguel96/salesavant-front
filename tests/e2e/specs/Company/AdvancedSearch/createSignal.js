beforeEach(() => {
  cy.login();
});
describe("Created Signal", () => {
  it("Advanced Search", () => {
    cy.advancedCompanies();
    cy.get("#field-company-name").type("salesavant");
    cy.get("#field-company-state").type("Florida");
    cy.get("#field-company-country").type("Alabama");
    cy.get("#button-search-company").click();
    cy.get("#name").should("have.text", "salesavant");
    cy.get("#state").should("have.text", "Florida");
    cy.get("#country").should("have.text", "Alabama");
    cy.get("#button-open-signal").click();
    cy.get("#field-signal-name").type("Signal Salesavant Florida Alabama");
    cy.get("#field-signal-description").type("Description cypress salesavant");
    cy.get("#field-signal-score").type("10");
    cy.get("#field-signal-group").type("Group Test");
    cy.get("#save-signal").click();
    cy.contains("Signal Salesavant Florida Alabama")
      .should(($div) => {
        expect($div).to.have.length(1);
      })
      .then(($div) => {
        expect($div).to.have.text("Signal Salesavant Florida Alabama");
      });
    cy.get(".v-data-footer__pagination").should("have.text", "1-1 of 1");
    cy.get("#field-name").should("have.value", "Signal Salesavant Florida Alabama");
    cy.get("#field-description").should("have.value", "Description cypress salesavant");
    cy.get("#field-score").should("have.value", "10");
    cy.get("#field-group").should( "have.value", "Group Test");
  });
});
