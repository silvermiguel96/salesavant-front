beforeEach(() => {
  cy.login();
});
describe("Created Signal", () => {
  it("Advanced Search created singal", () => {
    cy.advancedCompanies();
    cy.get("#field-company-name").type("salesavant");
    cy.get("#button-search-company").click();
    cy.get("#name").should("have.text", "salesavant");
    cy.get("#button-open-signal").click();
    cy.get("#field-signal-name").type("Siganl Name Salesavant");
    cy.get("#field-signal-description").type("Description cypress salesavant");
    cy.get("#field-signal-score").type("10");
    cy.get("#field-signal-group").type("Group Test");
    cy.get("#save-signal").click();
    cy.contains("Siganl Name Salesavant")
      .should(($div) => {
        expect($div).to.have.length(1);
      })
      .then(($div) => {
        expect($div).to.have.text("Siganl Name Salesavant");
      });
    cy.get(".v-data-footer__pagination").should("have.text", "1-1 of 1");
    cy.get("#field-name").should("have.value", "Siganl Name Salesavant");
    cy.get("#field-description").should("have.value", "Description cypress salesavant");
    cy.get("#field-score").should("have.value", "10");
    cy.get("#field-group").should( "have.value", "Group Test");
  });
});
