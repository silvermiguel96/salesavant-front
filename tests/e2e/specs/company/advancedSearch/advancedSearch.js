beforeEach(() => {
  cy.login();
});
describe("Search Name", () => {
  it("Advanced Search by Name", () => {
    cy.advancedCompanies();
    cy.get("#field-company-name").type("salesavant");
    cy.get("#button-search-company").click();
    cy.get("#filters")
      .find("span")
      .children("span")
      .and(($span) => {
        expect($span.get(1).textContent, "Field search ").to.match(/name/);
        expect($span.get(2).textContent, "Field").to.match(/salesavant/);
      });
    cy.get(".v-data-footer__pagination").should("have.text", "1-4 of 4", {
      matchCase: false,
    });
  });
});

describe("Search Description", () => {
  it("Advanced Search by Description ", () => {
    cy.advancedCompanies();
    cy.get("#field-company-description").type("salesavant");
    cy.get("#button-search-company").click();
    cy.get("#filters")
      .find("span")
      .children("span")
      .and(($span) => {
        expect($span.get(1).textContent, "Field description").to.match(
          /description/
        );
        expect($span.get(2).textContent, "Field").to.match(/salesavant/);
      });
    cy.get(".v-data-footer__pagination").should("have.text", "1-1 of 1");
  });
});

describe("Search Country", () => {
  it("Advanced Search by Country", () => {
    cy.advancedCompanies();
    cy.get("#field-company-country").type("Australia");
    cy.get("#button-search-company").click();
    cy.get("#filters")
      .find("span")
      .children("span")
      .and(($span) => {
        expect($span.get(1).textContent, "Field search").to.match(/country/);
        expect($span.get(2).textContent, "Field").to.match(/Australia/);
      });
    cy.get(".v-data-footer__pagination").should("have.text", "1-10 of 117441");
  });
});

// describe("Search Region", () => {
//   it("Advanced Search by  region", () => {
//     cy.advancedCompanies();
//     cy.get("#field-company-region").type("Midwest");
//     cy.get("#button-search-company").click();
//     cy.get("#region").should("have.text", "Midwest");
//     cy.get(".v-data-footer__pagination").should("have.text", "1-2 of 2");
//   });
// });

describe("Search City", () => {
  it("Advanced Search by city", () => {
    cy.advancedCompanies();
    cy.get("#field-company-city").type("como");
    cy.get("#button-search-company").click();
    cy.get("#filters")
      .find("span")
      .children("span")
      .and(($span) => {
        expect($span.get(1).textContent, "Field search").to.match(/city/);
        expect($span.get(2).textContent, "Field").to.match(/como/);
      });
    cy.get(".v-data-footer__pagination").should("have.text", "1-10 of 640");
  });
});

describe("Search State", () => {
  it("Advanced Search by state", () => {
    cy.advancedCompanies();
    cy.get("#field-company-state").type("Texas");
    cy.get("#button-search-company").click();
    cy.get("#filters")
      .find("span")
      .children("span")
      .and(($span) => {
        expect($span.get(1).textContent, "Field search").to.match(/state/);
        expect($span.get(2).textContent, "Field").to.match(/Texas/);
      });
    cy.get(".v-data-footer__pagination").should("have.text", "1-10 of 157127");
  });
});

// describe("Search websites keywords", () => {
//   it("Advanced Search by websites keywords", () => {
//     cy.advancedCompanies();
//     cy.get("#field-company-website").type("salesavant.com");
//     cy.get("#button-search-company").click();
//     cy.get("#website").should("have.text", "salesavant.com");
//     // cy.get(".v-data-table__wrapper > table > tbody > tr > td ").eq(6).should("have.text", "Midwest")
//     cy.get(".v-data-footer__pagination").should("have.text", "1-1 of 1");
//   });
// });

describe("Search Score", () => {
  it("Advanced Search by score ", () => {
    cy.advancedCompanies();
    cy.get("#field-company-moreThanScore").clear();
    cy.get("#field-company-moreThanScore").type("5");
    cy.get("#field-company-lessThanScore").clear();
    cy.get("#field-company-lessThanScore").type("6");
    cy.get("#button-search-company").click();
    cy.get("#filters")
      .find("span")
      .children("span")
      .and(($span) => {
        expect($span.get(1).textContent, "Field search").to.match(/moreThanScore/);
        expect($span.get(2).textContent, "Field").to.match(/5/);
        expect($span.get(4).textContent, "Field search").to.match(/lessThanScore/);
        expect($span.get(5).textContent, "Field").to.match(/6/);
      });
    cy.get(".v-data-footer__pagination").should("have.text", "1-10 of 48531");
  });
});

describe("Search Employes", () => {
  it("Advanced Search by employes ", () => {
    cy.advancedCompanies();
    cy.get("#field-company-moreThanEmployees").clear();
    cy.get("#field-company-moreThanEmployees").type("5");
    cy.get("#field-company-lessThanEmployees").clear();
    cy.get("#field-company-lessThanEmployees").type("6");
    cy.get("#button-search-company").click();
    cy.get("#filters")
      .find("span")
      .children("span")
      .and(($span) => {
        expect($span.get(1).textContent, "Field search").to.match(/moreThanEmployees/);
        expect($span.get(2).textContent, "Field").to.match(/5/);
        expect($span.get(4).textContent, "Field search").to.match(/lessThanEmployees/);
        expect($span.get(5).textContent, "Field").to.match(/6/);
      });
    cy.get(".v-data-footer__pagination").should("have.text", "1-10 of 432433");
  });
});

describe("Search industry", () => {
  it("Advanced Search by  industry", () => {
    cy.advancedCompanies();
    cy.get("#field-company-industry").type("E-Learning");
    cy.get("#button-search-company").click();
    cy.get("#filters")
      .find("span")
      .children("span")
      .and(($span) => {
        expect($span.get(1).textContent, "Field search").to.match(/industry/);
        expect($span.get(2).textContent, "Field").to.match(/E-Learning/);
      });
    cy.get(".v-data-footer__pagination").should("have.text", "1-10 of 23871");
  });
});

describe("Search Status", () => {
  it("Advanced Search by status", () => {
    cy.advancedCompanies();
    cy.get("#field-company-status").type("unknown");
    cy.get("#button-search-company").click();
    cy.get("#filters")
      .find("span")
      .children("span")
      .and(($span) => {
        expect($span.get(1).textContent, "Field search").to.match(/status/);
        expect($span.get(2).textContent, "Field").to.match(/unknown/);
      });
    cy.get(".v-data-footer__pagination").should("have.text", "1-10 of 4887508");
  });
});
