<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :server-items-length="totalResults"
    :items-per-page="options.itemsPerPage"
    :footer-props="{
      'items-per-page-options': [10, 20, 50]
    }"
    :options.sync="options"
    class="mx-2"
    @update:options="updateOptions"
    item-key="uid"
  >
    <template v-slot:item="{ item }">
      <tr>
        <td>
          <a
            :href="`${salesforceOauth}/lightning/r/${item.sfObjectType}/${item.sfId}/view`"
            target="_blank"
          >{{ JSON.parse(item.sfObject).name }}</a>
        </td>
        <td>
          <router-link
            v-if="item.mapping.length"
            :to="`/companies/${ item.mapping[0].company.uid}`"
          >{{ item.mapping[0].company.name }}</router-link>
        </td>
        <td>
          <div class="d-flex align-center justify-center">
            <modal-objects :title="item.sfObjectType" :item="item.sfObject" />
          </div>
        </td>
        <td v-if="item.mapping.length">
          <div class="d-flex align-center justify-center">
            <v-icon color="red lighten-2" size="20" small>delete</v-icon>
          </div>
        </td>
        <td v-else>
          <div class="d-flex align-center justify-center">
            <v-icon color="blue lighten-2" size="20" small>add_box</v-icon>
          </div>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import ModalObjects from "./Modal.vue";
import gql from "graphql-tag";
export default {
  data() {
    return {
      headers: [
        {
          text: "Salesforce",
          value: "fullName",
          width: "40%",
          sortable: false
        },
        {
          text: "Company",
          value: "companies.name",
          width: "40%",
          sortable: false
        },
        {
          text: "Details",
          align: "center",
          value: "companies.title",
          width: "10%",
          sortable: false
        },
        {
          text: "Add/Remove",
          value: "companies.deparment",
          width: "10%",
          sortable: false
        }
      ],
      options: {
        page: 1,
        itemsPerPage: 10
      },
      myUser: {
        oauths: {}
      }
    };
  },
  components: {
    ModalObjects
  },
  methods: {
    updateOptions(dataFromEvent = {}) {
      this.$emit("updateOptions", { dataFromEvent });
    }
  },
  props: {
    items: Array,
    totalResults: Number
  },
  apollo: {
    myUser: {
      query: gql`
        query {
          myUser {
            firstName
            lastName
            email
            status
            oauths {
              serviceName
              serviceUrl
            }
          }
        }
      `,
      fetchPolicy: "cache-and-network"
    }
  },
  computed: {
    salesforceOauth() {
      if (this.myUser.oauths.length > 0) {
        return this.myUser.oauths.find(
          oauth => oauth.serviceName.serviceUrl === "salesforce"
        );
      }
      return undefined;
    }
  }
};
</script>

<style scoped>
.wrapping-td {
  white-space: normal;
}
</style>

