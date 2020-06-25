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
          <div class="d-block text-capitalize ">{{ item.sfName }}</div>
          {{ item.sfId }}
        </td>
        <td>
          <code class="code">{{ JSON.stringify(JSON.parse(item.sfObject),null , 4) }}</code>
        </td>
        <td>
          {{ item.mapping[0].company.name }}
          <router-link :to="`/companies/${ item.mapping[0].company.uid}`">
            <long-paragraph :text="item.sfName" :maxLength="40"></long-paragraph>
          </router-link>
        </td>
        <td>
          <div class="d-flex align-center justify-center">
            <v-icon color="red lighten-2" size="20" small>delete</v-icon>
          </div>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import LongParagraph from "../../components/common/LongParagraph.vue";
export default {
  data() {
    return {
      headers: [
        {
          text: "Salesforce",
          value: "fullName",
          width: "30%",
          sortable: false
        },
        {
          text: "Objects",
          value: "companies.name",
          width: "30%",
          sortable: false
        },
        {
          text: "Company",
          value: "companies.title",
          width: "30%",
          sortable: false
        },
        {
          text: "Actions",
          value: "companies.deparment",
          width: "10%",
          sortable: false
        }
      ],
      options: {
        page: 1,
        itemsPerPage: 10
      }
    };
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
  components: {
    LongParagraph
  }
};
</script>

<style scoped>
.wrapping-td {
  white-space: normal;
}
.code {
  color:rgba(0,0,0,0.67);
  background: transparent;
  height: 0;
  font-family: sans-serif;
}
</style>

