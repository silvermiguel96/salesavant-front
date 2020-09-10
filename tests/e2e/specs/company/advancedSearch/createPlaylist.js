beforeEach(() => {
  cy.login();
});
describe("Created playlist search name", () => {
  it("Advanced Search", () => {
    cy.advancedCompanies();
    cy.get("#field-company-name").type("Salesavant");
    cy.get("#button-search-company").click();
    cy.get("#name").should("have.text", "Salesavant");
    cy.get("#button-open-playlist").click();
    cy.get("#field-playlist-name").type("Test cypress salesavant Playlist Salesavant");
    cy.get("#button-save-playlist").click();
    cy.url().should("include", "playlists/");
    cy.contains("Test cypress salesavant Playlist Salesavant")
      .should(($div) => {
        expect($div).to.have.length(1);
      })
      .then(($div) => {
        expect($div).to.have.text("Test cypress salesavant Playlist Salesavant");
      });
    cy.get(".v-data-footer__pagination").should("have.text", "1-1 of 1");
  });
});
