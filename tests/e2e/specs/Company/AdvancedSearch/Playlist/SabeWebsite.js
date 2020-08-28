describe("Created playlist", () => {
  it("Advanced Search", () => {
    cy.visit("/");
    cy.get("#field-login-email").type("alejandro@salesavant.com");
    cy.get("#field-login-password").type("qweqwe");
    cy.get("#button-login").click();
    cy.url().should("include", "/home");
    cy.visit("/companies");
    cy.get("#button-advanced-search").click();
    cy.get("#field-company-website").type("www.website.com");
    cy.get("#button-search-company").click();
    cy.get("#button-open-playlist").click();
    cy.get("#field-playlist-name").type("Test cypress salesavant Playlist www.website.com");
    cy.get("#save-playlist").click();
    cy.url().should("include", "playlists/");
    cy.contains("Test cypress salesavant Playlist www.website.com")
      .should(($div) => {
        expect($div).to.have.length(1);
      })
      .then(($div) => {
        expect($div).to.have.text("Test cypress salesavant Playlist www.website.com");
      });
    cy.get(".v-data-footer__pagination").should("have.text", "1-10 of 20");
  });
});
