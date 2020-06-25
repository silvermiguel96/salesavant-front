<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" xs="12" class="pt-0">
        <v-card>
          <v-row no-gutters>
            <v-col cols="12" xs="12" class="pt-0">
              <v-breadcrumbs
                class="pl-3 pl-sm-6"
                :large="true"
                :items="[
                {	          
                text: 'Salesforces Objects',	            
                disabled: true,	              
                }
              ]"
                divider=">"
              ></v-breadcrumbs>
            </v-col>
          </v-row>
          <v-container fluid>
            <v-row no-gutters>
              <v-row no-gutters class="d-flex justify-end">
                <v-col cols="12" sm="6" md="6" lg="6" class="pa-1">
                  <v-text-field
                    v-model="search"
                    append-icon="filter_list"
                    label="Quick Search"
                    placeholder="Type a Name"
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-row>
          </v-container>
          <v-row class="pt-4" no-gutters>
            <v-col cols="12">
              <!-- Result -->
              <!-- v-if="salesforceObjects" -->
              <salesforce-table
                :items="salesforceObjects.salesforceObjectList"
                :totalResults="salesforceObjects.totalResults"
                @updateOptions="updateOptions"
              ></salesforce-table>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col cols="12">
              <!-- Loading -->
              <v-progress-linear
                :active="!!isLoading"
                color="blue"
                indeterminate
                absolute
                bottom
                query
              ></v-progress-linear>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
import _get from "lodash.get";
import SalesforceTable from "../../components/salesforce/SalesforceTable.vue";

export default {
  data() {
    return {
      totalResults: 0,
      search: "",
      isLoading: false,
      options: {
        page: 1,
        itemsPerPage: 10,
        sortBy: "",
        sortOrder: ""
      },
      salesforceObjects: {
        totalResults: 186,
        salesforceObjectList: [
          {
            id: "1",
            sfId: "0015w00002B44EkAAJ",
            sfName: "genepoint",
            sfObjectType: "Account",
            sfObject:
              '{"id": "0015w00002B44EkAAJ", "name": "GenePoint", "sf_url": "/services/data/v42.0/sobjects/Account/0015w00002B44EkAAJ", "website": "www.genepoint.com", "owner_id": "0055w00000C5p8eAAB", "sf_object_type": "Account"}',
            mapping: [
              {
                company: {
                  uid: "d1ffaf1e-ee15-4ca6-b786-a774e7f860a2",
                  name: "www.genepoint.com"
                }
              }
            ]
          },
          {
            id: "2",
            sfId: "0015w00002B44EiAAJ",
            sfName: "uos",
            sfObjectType: "Account",
            sfObject:
              '{"id": "0015w00002B44EiAAJ", "name": "United Oil & Gas, UK", "sf_url": "/services/data/v42.0/sobjects/Account/0015w00002B44EiAAJ", "website": "http://www.uos.com", "owner_id": "0055w00000C5p8eAAB", "sf_object_type": "Account"}',
            mapping: [
              {
                company: {
                  uid: "c9b273b7-2eb9-4601-be11-fe61a505be04",
                  name: "http://www.uos.com"
                }
              }
            ]
          },
          {
            id: "3",
            sfId: "0015w00002B44EjAAJ",
            sfName: "uos",
            sfObjectType: "Account",
            sfObject:
              '{"id": "0015w00002B44EjAAJ", "name": "United Oil & Gas, Singapore", "sf_url": "/services/data/v42.0/sobjects/Account/0015w00002B44EjAAJ", "website": "http://www.uos.com", "owner_id": "0055w00000C5p8eAAB", "sf_object_type": "Account"}',
            mapping: [
              {
                company: {
                  uid: "c9b273b7-2eb9-4601-be11-fe61a505be04",
                  name: "http://www.uos.com"
                }
              }
            ]
          },
          {
            id: "4",
            sfId: "0015w00002B44EaAAJ",
            sfName: "edgecomm",
            sfObjectType: "Account",
            sfObject:
              '{"id": "0015w00002B44EaAAJ", "name": "Edge Communications", "sf_url": "/services/data/v42.0/sobjects/Account/0015w00002B44EaAAJ", "website": "http://edgecomm.com", "owner_id": "0055w00000C5p8eAAB", "sf_object_type": "Account"}',
            mapping: [
              {
                company: {
                  uid: "a47ea928-9e95-46e0-9302-c1ea23e14599",
                  name: "http://edgecomm.com"
                }
              }
            ]
          },
          {
            id: "5",
            sfId: "0015w00002B44EbAAJ",
            sfName: "burlington",
            sfObjectType: "Account",
            sfObject:
              '{"id": "0015w00002B44EbAAJ", "name": "Burlington Textiles Corp of America", "sf_url": "/services/data/v42.0/sobjects/Account/0015w00002B44EbAAJ", "website": "www.burlington.com", "owner_id": "0055w00000C5p8eAAB", "sf_object_type": "Account"}',
            mapping: [
              {
                company: {
                  uid: "df4f31aa-648e-4639-acd9-fe921821df12",
                  name: "www.burlington.com"
                }
              }
            ]
          },
          {
            id: "6",
            sfId: "0015w00002B44EcAAJ",
            sfName: "pyramid",
            sfObjectType: "Account",
            sfObject:
              '{"id": "0015w00002B44EcAAJ", "name": "Pyramid Construction Inc.", "sf_url": "/services/data/v42.0/sobjects/Account/0015w00002B44EcAAJ", "website": "www.pyramid.com", "owner_id": "0055w00000C5p8eAAB", "sf_object_type": "Account"}',
            mapping: [
              {
                company: {
                  uid: "e8353fde-ea7a-4955-b5a7-c2cc832fd45c",
                  name: "www.pyramid.com"
                }
              }
            ]
          },
          {
            id: "7",
            sfId: "0015w00002B44EdAAJ",
            sfName: "dickenson-consulting",
            sfObjectType: "Account",
            sfObject:
              '{"id": "0015w00002B44EdAAJ", "name": "Dickenson plc", "sf_url": "/services/data/v42.0/sobjects/Account/0015w00002B44EdAAJ", "website": "dickenson-consulting.com", "owner_id": "0055w00000C5p8eAAB", "sf_object_type": "Account"}',
            mapping: [
              {
                company: {
                  uid: "d2e26981-11e9-4601-883f-b36ce3986c1e",
                  name: "dickenson-consulting.com"
                }
              }
            ]
          },
          {
            id: "8",
            sfId: "0015w00002B44EeAAJ",
            sfName: "grandhotels",
            sfObjectType: "Account",
            sfObject:
              '{"id": "0015w00002B44EeAAJ", "name": "Grand Hotels & Resorts Ltd", "sf_url": "/services/data/v42.0/sobjects/Account/0015w00002B44EeAAJ", "website": "www.grandhotels.com", "owner_id": "0055w00000C5p8eAAB", "sf_object_type": "Account"}',
            mapping: [
              {
                company: {
                  uid: "ba5c9ea8-0f59-49bc-9103-acd0cf1fc615",
                  name: "www.grandhotels.com"
                }
              }
            ]
          },
          {
            id: "9",
            sfId: "0015w00002B44EgAAJ",
            sfName: "expressl&t",
            sfObjectType: "Account",
            sfObject:
              '{"id": "0015w00002B44EgAAJ", "name": "Express Logistics and Transport", "sf_url": "/services/data/v42.0/sobjects/Account/0015w00002B44EgAAJ", "website": "www.expressl&t.net", "owner_id": "0055w00000C5p8eAAB", "sf_object_type": "Account"}',
            mapping: [
              {
                company: {
                  uid: "fa6b0f4e-e84b-4182-bfff-81e9d04258ca",
                  name: "www.expressl&t.net"
                }
              }
            ]
          },
          {
            id: "10",
            sfId: "0015w00002B44EhAAJ",
            sfName: "uofabookstores",

            sfObjectType: "Account",
            sfObject:
              '{"id": "0015w00002B44EhAAJ", "name": "University of Arizona", "sf_url": "/services/data/v42.0/sobjects/Account/0015w00002B44EhAAJ", "website": "uofabookstores.com", "owner_id": "0055w00000C5p8eAAB", "sf_object_type": "Account"}',
            mapping: [
              {
                company: {
                  uid: "33a5636f-ee90-4d8d-9f5f-e204de03a5f8",
                  name: "uofabookstores.com"
                }
              }
            ]
          }
        ]
      }
    };
  },
  components: {
    SalesforceTable
  },
  methods: {
    updateOptions({
      dataFromEvent: { page = 1, itemsPerPage = 10, sortBy = [], sortDesc = [] }
    }) {
      this.options.page = page;
      this.options.itemsPerPage = itemsPerPage;
    }
  },
  computed: {
    contactSearch() {
      return this.$store.state.contactSearch;
    },
    searchType() {
      return this.$store.state.searchType;
    }
  },
  apollo: {
    // salesforceObjects: {
    //   query: gql`
    //     query salesforceObjects {
    //       salesforceObjects {
    //         totalResults
    //         salesforceObjectList {
    //           id
    //           sfId
    //           sfObjectType
    //           sfObject
    //           mapping {
    //             company {
    //               uid
    //               name
    //             }
    //           }
    //         }
    //       }
    //     }
    //   `,
    //   watchLoading(isLoading, countModifier) {
    //     this.isLoading = isLoading;
    //   },
    //   fetchPolicy: "cache-and-network"
    // }
  }
};
</script>
