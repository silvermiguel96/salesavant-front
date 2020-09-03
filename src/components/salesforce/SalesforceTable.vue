<template>
  <v-data-table
    :headers="headers"
    :items="parseItem"
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
            :href="`${item.sfConnection.salesforceUrl}/lightning/r/${item.sfObjectType}/${item.sfId}/view`"
            target="_blank"
          >{{ item.sfObject.name }}</a>
        </td>
        <td>
          <router-link
            v-if="item.mapping"
            :to="`/companies/${ item.mapping.company.uid}`"
          >{{ item.mapping.company.name }}</router-link>
        </td>
        <td>
          <div class="d-flex align-center justify-center">
            <modal-objects :title="item.sfObjectType" :item="item.sfObject" />
          </div>
        </td>
        <td v-if="item.mapping">
          <div class="d-flex align-center justify-center">
            <v-icon color="red lighten-2" @click="deleteObject(item)" size="20" small>delete</v-icon>
          </div>
        </td>
        <td v-else>
          <div class="d-flex align-center justify-center">
            <add-company :company="item" @addObjectModal="addObject" />
          </div>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import ModalObjects from "./Modal.vue";
import AddCompany from "./AddCompany.vue";
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
          text: this.headerText,
          value: "companies.deparment",
          align: "center",
          width: "10%",
          sortable: false
        }
      ],
      options: {
        page: 1,
        itemsPerPage: 10
      },
      item: {
        sfConnection: null
      }
    };
  },
  components: {
    ModalObjects,
    AddCompany
  },
  props: {
    items: Array,
    totalResults: Number,
    headerText: String
  },
  computed: {
    parseItem() {
      return this.items.map(item => {
        if (typeof item.sfObject === "string") {
          let sfObject = JSON.parse(item.sfObject);
          item.sfObject = sfObject;
        }
        return item;
      });
    }
  },
  methods: {
    updateOptions(dataFromEvent = {}) {
      this.$emit("updateOptions", { dataFromEvent });
    },
    async addObject(object) {
      console.log("Objet", object);
      const index = this.parseItem.indexOf(object.objectCompany);
      console.log("index", index);
      const result = await this.$apollo.mutate({
        mutation: gql`
          mutation($companyUid: String!, $sfObjectId: Int!) {
            createSalesforceMapping(
              companyUid: $companyUid
              sfObjectId: $sfObjectId
            ) {
              status
              message
              salesforceMapping {
                id
                company {
                  uid
                  name
                }
              }
            }
          }
        `,
        // Parameters
        variables: {
          companyUid: object.company.companyUid,
          sfObjectId: parseInt(object.objectCompany.id)
        }
      });
      console.log("result", result);
      if (result.data.createSalesforceMapping.status === "ok") {
        console.log("this.parseItem[index]", this.parseItem[index]);
        this.parseItem[index].mapping = result.data.createSalesforceMapping.salesforceMapping;
        this.items.splice(index, 1);
        // this.options.itemsPerPage -= 1;
        this.$emit("matchedCompanies", object);
        this.$eventBus.$emit(
          "showSnack",
          "SalesForce mapping successfully created",
          "success"
        );
        return;
      } else {
        this.$eventBus.$emit(
          "showSnack",
          `${result.data.createSalesforceMapping.message}!!`,
          "error"
        );
        return;
      }
    },
    async deleteObject(object) {
      console.log("object", object);
      const res = await this.$confirm(
        `<h1 class="subtitle-1">
              Confirm you want to eliminate the mapping for company
              <span class="font-weight-bold"
              >${object.sfObject.name}</span>?
            </h1> `,
        {
          buttonTrueText: "delete",
          buttonFalseText: "close",
          buttonTrueColor: "red lighten-2",
          color: "primary",
          icon: "delete",
          title: "Delete signal",
          width: 600
        }
      );
      if (res) {
        const index = this.parseItem.indexOf(object);
        console.log("parseItem", object.mapping.id);
        const result = await this.$apollo.mutate({
          mutation: gql`
            mutation($salesforceMappingId: Int!) {
              deleteSalesforceMapping(
                salesforceMappingId: $salesforceMappingId
              ) {
                status
                message
              }
            }
          `,
          // Parameters
          variables: {
            salesforceMappingId: parseInt(object.mapping.id)
          }
        });
        console.log("result", result);
        if (result.data.deleteSalesforceMapping.status === "ok") {
          console.log("this.parseItem[index]", this.parseItem[index]);
          this.parseItem[index].mapping = "";
          this.items.splice(index, 1);
          // this.options.itemsPerPage -= 1;
          console.log("object", object)
          this.$emit("matchedNotCompanies", object);
          this.$eventBus.$emit(
            "showSnack",
            "SalesForce mapping successfully deleted",
            "success"
          );
          return;
        } else {
          this.$eventBus.$emit(
            "showSnack",
            `${result.data.deleteSalesforceMapping.message}!!`,
            "error"
          );
          return;
        }
      }
    }
  }
};
</script>

<style scoped>
.wrapping-td {
  white-space: normal;
}
</style>

