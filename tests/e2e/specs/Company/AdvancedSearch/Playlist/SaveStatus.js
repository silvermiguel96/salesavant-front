beforeEach(() => {
  cy.login();
});
describe("Created playlist search Status", () => {
  it("Advanced Search", () => {
    cy.visit("/companies");
    cy.get("#button-advanced-search").click();
    cy.get("#field-company-status").type("active");
    cy.get("#button-search-company").click();
    cy.get("#button-open-playlist").click();
    cy.get("#field-playlist-name").type("Test cypress salesavant Playlist Status active");
    cy.get("#button-save-playlist").click();
    cy.url().should("include", "playlists/");
    cy.contains("Test cypress salesavant Playlist Status active")
      .should(($div) => {
        expect($div).to.have.length(1);
      })
      .then(($div) => {
        expect($div).to.have.text("Test cypress salesavant Playlist Status active");
      });
    cy.get(".v-data-footer__pagination").should("have.text", "1-10 of 14");
  });
});
