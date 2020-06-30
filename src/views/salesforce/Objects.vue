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
              <salesforce-table
                v-if="salesforceObjects"
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
      isLoading: true,
      options: {
        page: 1,
        itemsPerPage: 10,
        sortBy: "",
        sortOrder: ""
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
  apollo: {
    salesforceObjects: {
      query: gql`
        query salesforceObjects($first: Int, $offset: Int) {
          salesforceObjects(first: $first, offset: $offset) {
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
            this.options.itemsPerPage
        };
      },
      watchLoading(isLoading, countModifier) {
        this.isLoading = isLoading;
      },
      fetchPolicy: "cache-and-network"
    }
  }
};
</script>
