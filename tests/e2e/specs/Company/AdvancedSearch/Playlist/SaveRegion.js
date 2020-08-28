beforeEach(() => {
  cy.login();
});
describe("Created playlist search Employes", () => {
  it("Advanced Search", () => {
    cy.visit("/companies");
    cy.get("#button-advanced-search").click();
    cy.get("#field-company-region").type("Antioquia");
    cy.get("#button-search-company").click();
    cy.get("#button-open-playlist").click();
    cy.get("#field-playlist-name").type("Test cypress salesavant Playlist region");
    cy.get("#button-save-playlist").click();
    cy.url().should("include", "playlists/");
    cy.contains("Test cypress salesavant Playlist region")
      .should(($div) => {
        expect($div).to.have.length(1);
      })
      .then(($div) => {
        expect($div).to.have.text("Test cypress salesavant Playlist region");
      });
    cy.get(".v-data-footer__pagination").should("have.text", "1-1 of 1");
  });
});