beforeEach(() => {
  cy.login();
});
describe("Search Name", () => {
  it("Advanced Search by Name", () => {
    cy.advancedCompanies();
    cy.get("#field-company-name").type("salesavant");
    cy.get("#button-search-company").click();
    cy.get(".v-data-table__wrapper > table > tbody > tr > td ").eq(0).get("td > a > div > span").should("have.text", "SaleSavant");
    cy.get(".v-data-footer__pagination").should("have.text", "1-1 of 1");
  });
});

describe("Search Description", () => {
  it("Advanced Search by Description ", () => {
    cy.advancedCompanies();
    cy.get("#field-company-description").type("salesavant");
    cy.get("#button-search-company").click();
    cy.get("#description").should("have.text", "salesavant");
    cy.get(".v-data-footer__pagination").should("have.text", "1-1 of 1");
  });
});

describe("Search Country", () => {
  it("Advanced Search by Country", () => {
    cy.advancedCompanies();
    cy.get("#field-company-country").type("USA");
    cy.get("#button-search-company").click();
    cy.get("#country").should("have.text", "USA");
    cy.get(".v-data-table__wrapper > table > tbody > tr > td ").eq(4).should("have.text", "USA")
    cy.get(".v-data-footer__pagination").should("have.text", "1-1 of 1");
  });
});

describe("Search Region", () => {
  it("Advanced Search by  region", () => {
    cy.advancedCompanies();
    cy.get("#field-company-region").type("Midwest");
    cy.get("#button-search-company").click();
    cy.get("#region").should("have.text", "Midwest");
    cy.get(".v-data-footer__pagination").should("have.text", "1-2 of 2");
  });
});

describe("Search City", () => {
  it("Advanced Search by city", () => {
    cy.advancedCompanies();
    cy.get("#field-company-city").type("California");
    cy.get("#button-search-company").click();
    cy.get("#city").should("have.text", "California");
    cy.get(".v-data-footer__pagination").should("have.text", "1-1 of 1");
  });
});

describe("Search State", () => {
  it("Advanced Search by state", () => {
    cy.advancedCompanies();
    cy.get("#field-company-state").type("Azirona");
    cy.get("#button-search-company").click();
    cy.get("#state").should("have.text", "Azirona");
    // cy.get(".v-data-table__wrapper > table > tbody > tr > td ").eq(6).should("have.text", "Midwest")
    cy.get(".v-data-footer__pagination").should("have.text", "1-1 of 1");
  });
});

describe("Search websites keywords", () => {
  it("Advanced Search by websites keywords", () => {
    cy.advancedCompanies();
    cy.get("#field-company-website").type("salesavant.com");
    cy.get("#button-search-company").click();
    cy.get("#website").should("have.text", "salesavant.com");
    // cy.get(".v-data-table__wrapper > table > tbody > tr > td ").eq(6).should("have.text", "Midwest")
    cy.get(".v-data-footer__pagination").should("have.text", "1-1 of 1");
  });
});

describe("Search Score", () => {
  it("Advanced Search by score ", () => {
    cy.advancedCompanies();
    cy.get("#field-company-moreThanScore").clear();
    cy.get("#field-company-moreThanScore").type("0");
    cy.get("#field-company-lessThanScore").clear();
    cy.get("#field-company-lessThanScore").type("0");
    cy.get("#button-search-company").click();
    cy.get("#moreThanScore").should("have.text", "0");
    cy.get("#lessThanScore").should("have.text", "0");
    cy.get(".v-data-table__wrapper > table > tbody > tr > td ").eq(1).should("have.text", "0")
    cy.get(".v-data-footer__pagination").should("have.text", "1-4 of 4");
  });
});


describe("Search Employes", () => {
  it("Advanced Search by employes ", () => {
    cy.advancedCompanies();
    cy.get("#field-company-moreThanEmployees").clear();
    cy.get("#field-company-moreThanEmployees").type("19");
    cy.get("#field-company-lessThanEmployees").clear();
    cy.get("#field-company-lessThanEmployees").type("22");
    cy.get("#button-search-company").click();
    cy.get("#moreThanEmployees").should("have.text", "19");
    cy.get("#lessThanEmployees").should("have.text", "22");
    cy.get(".v-data-table__wrapper > table > tbody > tr > td ").eq(2).should("have.text", "20")
    cy.get(".v-data-footer__pagination").should("have.text", "1-1 of 1");
  });
});

describe("Search State", () => {
  it("Advanced Search by State", () => {
    cy.advancedCompanies();
    cy.get("#field-company-state").type("Florida");
    cy.get("#button-search-company").click();
    cy.get("#state").should("have.text", "Florida");
    cy.get(".v-data-table__wrapper > table > tbody > tr > td ").eq(3).should("have.text", "Florida")
    cy.get(".v-data-footer__pagination").should("have.text", "1-1 of 1");
  });
});


describe("Search industry", () => {
  it("Advanced Search by  industry", () => {
    cy.advancedCompanies();
    cy.get("#field-company-industry").type("Sales Intelligence");
    cy.get("#button-search-company").click();
    cy.get("#industry").should("have.text", "Sales Intelligence");
    cy.get(".v-data-table__wrapper > table > tbody > tr > td ").eq(6).should("have.text", "sales intelligence+-")
    cy.get(".v-data-footer__pagination").should("have.text", "1-1 of 1");
  });
});

describe("Search Status", () => {
  it("Advanced Search by status", () => {
    cy.advancedCompanies();
    cy.get("#field-company-status").type("unknown");
    cy.get("#button-search-company").click();
    cy.get("#status").should("have.text", "unknown");
    cy.get(".v-data-footer__pagination").should("have.text", "1-4 of 4");
  });
});
