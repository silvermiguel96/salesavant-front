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
                  },
                ]"
                divider=">"
              ></v-breadcrumbs>
            </v-col>
          </v-row>
          <v-tabs grow background-color="grey lighten-5" color="primary">
            <!-- Tab Home -->
            <v-tab class="text-capitalize">Companies</v-tab>
            <v-tab-item>
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
                  <salesforce-table
                    v-if="salesforceObjectsMapped"
                    :items="salesforceObjectsMapped.salesforceObjectList"
                    :totalResults="salesforceObjectsMapped.totalResults"
                    :headerText="'Remove'"
                    @updateOptions="updateOptions"
                    @matchedNotCompanies="deleteMatchedCompanies"
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
            </v-tab-item>
            <!-- tab comments -->
            <v-tab class="text-capitalize">Not Matched</v-tab>
            <v-tab-item>
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
                  <salesforce-table
                    v-if="salesforceObjectsNotMapped"
                    :items="salesforceObjectsNotMapped.salesforceObjectList"
                    :totalResults="salesforceObjectsNotMapped.totalResults"
                    :headerText="'Add'"
                    @updateOptions="updateOptions"
                    @matchedCompanies="addMatchedCompanies"
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
            </v-tab-item>
          </v-tabs>
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
      isLoading: true,
      options: {
        page: 1,
        itemsPerPage: 10,
        sortBy: "",
        sortOrder: "",
      },
    };
  },
  components: {
    SalesforceTable,
  },
  methods: {
    updateOptions({
      dataFromEvent: {
        page = 1,
        itemsPerPage = 10,
        sortBy = [],
        sortDesc = [],
      },
    }) {
      this.options.page = page;
      this.options.itemsPerPage = itemsPerPage;
    },
    addMatchedCompanies() {
      this.$apollo.queries.salesforceObjectsMapped.refresh();
      this.$apollo.queries.salesforceObjectsNotMapped.refresh();
    },
    deleteMatchedCompanies() {
      this.$apollo.queries.salesforceObjectsMapped.refresh();
      this.$apollo.queries.salesforceObjectsNotMapped.refresh();
    },
  },
  apollo: {
    salesforceObjectsMapped: {
      query: gql`
        query salesforceObjects($first: Int, $offset: Int, $mappingStatus: String) {
          salesforceObjects(first: $first, offset: $offset, mappingStatus: $mappingStatus) {
            totalResults
            salesforceObjectList {
              id
              sfId
              sfObjectType
              sfObject
              sfConnection {
                salesforceUrl
              }
              mapping {
                id
                company {
                  uid
                  name
                }
              }
            }
          }
        }
      `,
      variables() {
        return {
          first: this.options.itemsPerPage,
          offset:
            this.options.itemsPerPage * this.options.page -
            this.options.itemsPerPage,
          mappingStatus: "mapped"
        };
      },
      watchLoading(isLoading, countModifier) {
        this.isLoading = isLoading;
      },
      update: data => data.salesforceObjects,
      fetchPolicy: "cache-and-network",
    },
    salesforceObjectsNotMapped: {
      query: gql`
        query salesforceObjectsMapped($first: Int, $offset: Int, $mappingStatus: String) {
          salesforceObjects(first: $first, offset: $offset, mappingStatus: $mappingStatus) {
            totalResults
            salesforceObjectList {
              id
              sfId
              sfObjectType
              sfObject
              sfConnection {
                salesforceUrl
              }
              mapping {
                id
                company {
                  uid
                  name
                }
              }
            }
          }
        }
      `,
      variables() {
        return {
          first: this.options.itemsPerPage,
          offset:
            this.options.itemsPerPage * this.options.page -
            this.options.itemsPerPage,
          mappingStatus: "notmapped"
        };
      },
      watchLoading(isLoading, countModifier) {
        this.isLoading = isLoading;
      },
      update: data => data.salesforceObjects,
      fetchPolicy: "cache-and-network",
    },
  },
};
</script>
