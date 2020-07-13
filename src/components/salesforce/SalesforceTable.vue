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
          >{{ item.sfObject.name }} </a>
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
      item: {
        sfConnection: null
      }
    };
  },
  components: {
    ModalObjects,
    AddCompany
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
    async deleteObject(object) {
      console.log("object", object);
      const res = await this.$confirm(
        `<h1 class="subtitle-1">
              Confirm you want to eliminate the company
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
        try {
          // const index = this.items.salesforceObjectList.indexOf(JSON.parse(object));
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
              salesforceMappingId: parseInt(object.mapping[0].id)
            }
          });
          console.log("result", result);
          this.items.salesforceObjectList.splice(index, 1);
          this.items.totalResults -= 1;
          this.$eventBus.$emit(
            "showSnack",
            "The company successfully delete!!",
            "success"
          );
        } catch (error) {
          console.log("error", error);
          this.$eventBus.$emit(
            "showSnack",
            "Oops!! we did something wrong when removing the company, please try again!!",
            "error"
          );
          return;
        }
      }
    },
    async addObject(object) {
      try {
        console.log("Objet", object);
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
                }
              }
            }
          `,
          // Parameters
          variables: {
            companyUid: object.company.companyUid,
            sfObjectId: object.objectCompany.sfId
          }
        });
        console.log("result", result);
        this.$eventBus.$emit(
          "showSnack",
          "The company was successfully assigned!!",
          "success"
        );
      } catch (error) {
        console.log("error", error);
        this.$eventBus.$emit(
          "showSnack",
          "Oops!! we did something wrong when adding the company , please try again!!",
          "error"
        );
        return;
      }
    }
  },
  props: {
    items: Array,
    totalResults: Number
  }
};
</script>

<style scoped>
.wrapping-td {
  white-space: normal;
}
</style>

