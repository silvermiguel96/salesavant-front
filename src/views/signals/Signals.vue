<template>
  <v-container fluid class="py-0">
    <v-row>
      <v-col cols="12" xs="12">
        <v-card>
          <v-row no-gutters>
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
              <div class="mt-2">
                <span class="ml-2">Filtering by:</span>
                <v-chip
                  v-if="this.$route.query.group"
                  class="mx-1"
                  style="padding: 0 8px;"
                  color="light-blue darken-1"
                  dark
                  close
                  small
                  @click:close="removeFilter()"
                  outlined
                >
                  <strong>Company group:</strong>
                  {{ this.$route.query.group }}
                </v-chip>
              </div>
            </v-col>
          </v-row>
          <v-container fluid>
            <v-row no-gutters>
              <v-col cols="12" sm="3" md="3" lg="2" class="pa-1">
                <v-btn
                  class="text-capitalize"
                  color="primary"
                  min-width="150"
                  block
                  to="/signals/create"
                >
                  <v-icon size="18" class="mr-2">add</v-icon>new signal
                </v-btn>
              </v-col>
              <v-row no-gutters class="d-flex justify-end">
                <v-col cols="12" sm="6" md="6" lg="6" class="pa-1">
                  <v-text-field
                    v-model="search"
                    append-icon="filter_list"
                    label="Quick Search"
                    placeholder="Type a Name, Description or Group "
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-row>
          </v-container>
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
        sortOrder: "",
      },
    };
  },
  components: {
    SignalsTable,
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
      if (sortBy.length > 0) {
        switch (sortBy[0]) {
          case "score":
            this.options.sortBy = "score";
            break;
          case "modificationTime":
            this.options.sortBy = "modification_time";
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
            signalId: singal.id,
          },
        });

        this.signals.signalsList.splice(index, 1);
        this.signals.totalResults -= 1;
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
    },
  },
  apollo: {
    signals: {
      query: gql`
        query signals(
          $search: String
          $group: String
          $category: String
          $sortBy: String
          $sortOrder: String
          $first: Int
          $offset: Int
        ) {
          signals(
            search: $search
            sortBy: $sortBy
            sortOrder: $sortOrder
            first: $first
            offset: $offset
            group: $group
            category: $category
          ) {
            totalResults
            signalsList {
              id
              name
              group
              account {
                id
              }
              category
              accountId
              description
              creationTime
              score
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
          sortBy: this.options.sortBy,
          sortOrder: this.options.sortOrder,
          first: this.options.itemsPerPage,
          offset:
            this.options.itemsPerPage * this.options.page -
            this.options.itemsPerPage,
        };
      },
      skip() {
        return this.search.length > 0 && this.search.length < 2;
      },
      watchLoading(isLoading, countModifier) {
        this.isLoading = isLoading;
      },
      fetchPolicy: "cache-and-network",
    },
  },
  beforeMount() {
    this.isFiltered = this.checkIfIsFiltered();
  },
  beforeUpdate() {
    this.isFiltered = this.checkIfIsFiltered();
  },
  updated() {
    this.isFiltered = this.checkIfIsFiltered();
  },
};
</script>
