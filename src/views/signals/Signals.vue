<template>
  <v-container fluid class="py-0">
    <v-row>
      <v-col cols="12" xs="12">
        <v-card>
          <v-row no-gutters >
            <v-breadcrumbs
              :large="true"
              :items="[
                {
                  text: 'Signals',
                  disabled: true,
                  href: '/signals'
                }
              ]"
              divider=">"
            ></v-breadcrumbs>
          </v-row>

          <v-row no-gutters v-if="!!isFiltered">
            <v-col cols="12" md="8">
              <div class="mt-6">
                <span class="ml-2">Filtering by:</span>
              </div>
              <v-chip
                v-if="this.$route.query.group"
                class="mx-1 text-capitalize"
                style="padding: 0 8px;"
                color="blue-grey"
                @click:close="removeFilter()"
                outlined
                close
                small
              >
                <strong>Company group:</strong>
                {{ this.$route.query.group }}
              </v-chip>
            </v-col>
          </v-row>

          <v-row no-gutters class="pl-2 pl-sm-6">
            <v-col cols="11" md="4">
              <v-text-field
                v-model="search"
                append-icon="filter_list"
                label="Filter"
                single-line
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="8">
              <div class="d-flex justify-md-end">
                <div class="mt-3 mr-2">
                  <v-btn
                    class="text-capitalize"
                    color="primary"
                    min-width="150"
                    to="/signals/create"
                  >
                    <v-icon size="18" class="mr-2">add</v-icon>new signal
                  </v-btn>
                </div>
              </div>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col cols="12">
              <!-- Result -->
              <signals-table
                v-if="signals"
                :items="signals.signalsList"
                :totalResults="signals.totalResults"
                @updateOptions="updateOptions"
                @deleteSignal="deleteSignal"
              ></signals-table>
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
import SignalsTable from "../../components/signals/SignalsTable.vue";
import gql from "graphql-tag";
import { setTimeout } from "timers";
import { mapMutations } from "../../store";

export default {
  data() {
    return {
      items: ["signals"],
      isLoading: true,
      search: "",
      options: {
        page: 1,
        itemsPerPage: 10,
        sortBy: "",
        sortOrder: ""
      }
    };
  },
  components: {
    SignalsTable
  },
  methods: {
    updateOptions({
      dataFromEvent: { page = 1, itemsPerPage = 10, sortBy = [], sortDesc = [] }
    }) {
      this.options.page = page;
      this.options.itemsPerPage = itemsPerPage;
    },
    async deleteSignal(singal) {
      try {
        console.log(singal);
        const index = this.signals.signalsList.indexOf(singal);
        let result = null;
        result = await this.$apollo.mutate({
          mutation: gql`
            mutation($signalId: Int!) {
              deleteSignal(signalId: $signalId) {
                signal {
                  id
                }
              }
            }
          `,
          variables: {
            signalId: singal.id
          }
        });

        console.log("Result", result);
        this.signals.signalsList.splice(index, 1);
        console.log(this.$apollo.queries);
        this.$eventBus.$emit(
          "showSnack",
          "The signal successfully delete!!",
          "success"
        );

        return;
      } catch (error) {
        this.$eventBus.$emit(
          "showSnack",
          "Oops!! we did something wrong when removing the company - signal, please try again!!",
          "error"
        );
      } finally {
        this.showTable = true;
      }
    },
    checkIfIsFiltered() {
      let result = false;
      for (let key in this.$route.query) {
        console.log("key", key);
        if (!!this.$route.query[key] && key !== "searchType") {
          result = true;
          break;
        }
      }
      return result;
    },
    removeFilter() {
      this.$router.push({ path: "/signals", query: {} });
    }
  },
  apollo: {
    signals: {
      query: gql`
        query signals(
          $search: String
          $group: String
          $category: String
          $first: Int
          $offset: Int
        ) {
          signals(
            search: $search
            first: $first
            offset: $offset
            group: $group
            category: $category
          ) {
            totalResults
            signalsList {
              id
              name
              user {
                id
              }
              group
              userId
              account {
                id
              }
              category
              accountId
              description
              creationTime
              defaultScore
              modificationTime
            }
          }
        }
      `,
      variables() {
        return {
          search: this.search,
          group: this.$route.query.group,
          category: this.$route.query.category,
          first: this.options.itemsPerPage,
          offset:
            this.options.itemsPerPage * this.options.page -
            this.options.itemsPerPage
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
  },
  beforeMount() {
    this.isFiltered = this.checkIfIsFiltered();
  },
  beforeUpdate() {
    this.isFiltered = this.checkIfIsFiltered();
  },
  updated() {
    this.isFiltered = this.checkIfIsFiltered();
  }
};
</script>
