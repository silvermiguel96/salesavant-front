<template>
  <v-container fluid>
    <v-card>
      <div class="apollo-example">
        <v-breadcrumbs
          v-if="!!this.$route.query && !!this.$route.query.searchType"
          :large="true"
          :items="[
            {
              text: 'Contants',
              disabled: false,
              href: '/Contants'
            },
            {
              text: `${this.$route.query.searchType} search`,
              disabled: true,
              href: '/Contants'
            }
          ]"
          divider=">"
        >
          <template v-slot:item="props">
            <v-breadcrumbs-item
              :href="props.item.href"
              :class="[props.item.disabled && 'disabled']"
              @click.prevent="$router.push(props.item.href)"
            >{{ props.item.text }}</v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
        <v-breadcrumbs
          v-else
          :large="true"
          :items="[
        {
          text: 'Contacts',
          disabled: true,
          href: '/Contacts'
        }
      ]"
          divider=">"
        ></v-breadcrumbs>
        <v-container fluid class="mx-1">
          <v-row no-gutters class="ml-2">
            <v-col cols="12" md="4">
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Filter"
                single-line
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="2">
              <div>
                <a
                  @click.prevent="triggerSearch"
                  class="text-capitalize body-2"
                  block
                  color="primary"
                >Advanced Search</a>
              </div>
            </v-col>
          </v-row>
        </v-container>
        <!-- Result -->
        <contacts-table
          v-if="contacts"
          :items="contacts.contactsList"
          :totalResults="contacts.totalResults"
          @updateOptions="updateOptions"
        ></contacts-table>
        <!-- Loading -->
        <v-row justify="center" no-gutters>
          <v-col cols="12">
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
      </div>
    </v-card>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
import ContactsTable from "../../components/contacts/ContactsTable.vue";
import { mapMutations } from "vuex";

export default {
  data() {
    return {
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
    ContactsTable
  },
  methods: {
    ...mapMutations([
      'showSearchDialog'
    ]),
    triggerSearch() {
      this.showSearchDialog('contacts');
    },
    updateOptions({
      dataFromEvent: { page = 1, itemsPerPage = 10, sortBy = [], sortDesc = [] }
    }) {
      this.options.page = page;
      this.options.itemsPerPage = itemsPerPage;
      if (sortBy.length > 0) {
        switch (sortBy[0]) {
          case "scaleScoreAverage":
            this.options.sortBy = "scale_score_average";
            break;
          case "capitalEfficiencyScoreAverage":
            this.options.sortBy = "capital_efficiency_score_average";
            break;
          case "wolfpackScore":
            this.options.sortBy = "wolfpack_score";
            break;
          case "numberOfExits":
            this.options.sortBy = "number_of_exits";
            break;
        }
      } else {
        this.options.sortBy = "";
      }
      if (sortDesc.length > 0) {
        if (sortDesc[0]) {
          this.options.sortOrder = "desc";
        } else {
          this.options.sortOrder = "asc";
        }
      } else {
        this.options.sortOrder = "";
      }
    }
  },
  apollo: {
    contacts: {
      query: gql`
        query contacts(
          $search: String
          $sortBy: String
          $sortOrder: String
          $first: Int
          $offset: Int
        ) {
          contacts(
            search: $search
            sortBy: $sortBy
            sortOrder: $sortOrder
            first: $first
            offset: $offset
          ) {
            totalResults
            contactsList {
              uid
              fullName
              linkedinHandle
              scaleScoreAverage
              capitalEfficiencyScoreAverage
              wolfpackScore
              numberOfExits
              companies {
                title
                rank
                department
                isCurrent
                company {
                  uid
                  name
                  scaleScore
                  capitalEfficiencyScore
                }
              }
            }
          }
        }
      `,
      variables() {
        return {
          search: this.search,
          sortBy: this.options.sortBy,
          sortOrder: this.options.sortOrder,
          first: this.options.itemsPerPage,
          offset: this.options.itemsPerPage * this.options.page - this.options.itemsPerPage
        };
      },
      skip() {
        return this.search.length > 0 && this.search.length < 2;
      },
      watchLoading(isLoading, countModifier) {
        this.isLoading = isLoading;
      },
      fetchPolicy: "cache-and-network"
    }
  }
};
</script>
