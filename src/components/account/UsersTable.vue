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
  >
    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.firstName }} {{ item.lastName}}</td>
        <td>{{ item.email }}</td>
        <td class="text-capitalize">{{ item.status}}</td>
        <td>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <div class="d-flex align-center justify-center">
                <v-icon
                  @click="removePlaylist(item)"
                  color="deep-orange lighten-2"
                  size="20"
                  small
                  v-bind="attrs"
                  v-on="on"
                >person</v-icon>
              </div>
            </template>
            <span>Inactive User</span>
          </v-tooltip>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        { text: "Name", value: "name", width: "35%", sortable: false },
        { text: "Email", value: "totalScore", width: "35%", sortable: true },
        {
          text: "Status",
          value: "numEmployees",
          width: "15%",
          sortable: true,
          divider: true
        },
        {
          text: "Action",
          align: "center",
          value: "state",
          width: "15%",
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
    },
    async removePlaylist(item) {
      const res = await this.$confirm(
        ` <h1 class="subtitle-1">Confirm you want to Inactive User 
        <span class="font-weight-bold">${item.firstName} ${item.lastName}</span>?</h1>`,
        {
          buttonTrueText: "Inactive",
          buttonFalseText: "close",
          buttonTrueColor: "red lighten-2",
          color: "deep-orange lighten-2",
          icon: "warning",
          title: "Inactive User",
          width: 600
        }
      );
      if (res) {
        console.log("the playlist", item);
        this.$emit("deletePlaylist", item);
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

