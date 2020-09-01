beforeEach(() => {
  cy.login();
});
describe("Created playlist search city", () => {
  it("Advanced Search", () => {
    cy.advancedCompanies();
    cy.get("#field-company-city").type("New York");
    cy.get("#field-company-moreThanEmployees").clear();
    cy.get("#field-company-moreThanEmployees").type("5");
    cy.get("#field-company-lessThanEmployees").clear();
    cy.get("#field-company-lessThanEmployees").type("25");
    cy.get("#field-company-state").type("Florida");
    cy.get("#field-company-country").type("Alabama");
    cy.get("#button-search-company").click();
    cy.get("#city").should("have.text", "New York");
    cy.get("#button-open-playlist").click();
    cy.get("#field-playlist-name").type("Test cypress salesavant Playlist city Employes state country");
    cy.get("#button-save-playlist").click();
    cy.url().should("include", "playlists/");
    cy.contains("Test cypress salesavant Playlist city Employes state country")
      .should(($div) => {
        expect($div).to.have.length(1);
      })
      .then(($div) => {
        expect($div).to.have.text("Test cypress salesavant Playlist city Employes state country");
      });
    cy.get(".v-data-footer__pagination").should("have.text", "1-1 of 1");
  });
});
