<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="users"
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
          <td>{{ item.fullName }}</td>
          <td>{{ item.email }}</td>
          <td class="text-capitalize">{{ item.status}}</td>
          <td v-if="item.status === 'active'">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <div class="d-flex align-center justify-center">
                  <v-icon
                    @click="deactivateUser(item)"
                    color="primary"
                    size="20"
                    small
                    v-bind="attrs"
                    v-on="on"
                  >person</v-icon>
                </div>
              </template>
              <span>Deactivate user</span>
            </v-tooltip>
          </td>
          <td v-if="item.status === 'inactive'">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <div class="d-flex align-center justify-center">
                  <v-icon
                    @click="activeUser(item)"
                    color="primary"
                    size="20"
                    small
                    v-bind="attrs"
                    v-on="on"
                  >person_outline</v-icon>
                </div>
              </template>
              <span>Active user</span>
            </v-tooltip>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
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
          divider: true,
        },
        {
          text: "Action",
          align: "center",
          value: "state",
          width: "15%",
          sortable: false,
        },
      ],
      options: {
        page: 1,
        itemsPerPage: 10,
      },
    };
  },
  computed: {
    users() {
      return this.items.map((item) => {
        if (item.firstName || item.lastName) {
          return { ...item, fullName: `${item.firstName} ${item.lastName}` };
        } else {
          return { ...item, fullName: "--" };
        }
      });
    },
  },
  methods: {
    updateOptions(dataFromEvent = {}) {
      this.$emit("updateOptions", { dataFromEvent });
    },
    async deactivateUser(item) {
      const res = await this.$confirm(
        ` <h1 class="subtitle-1">Confirm you want to deactivate User 
        <span class="font-weight-bold">${item.email}</span>?</h1>`,
        {
          buttonTrueText: "Deactivate",
          buttonFalseText: "close",
          buttonTrueColor: "red lighten-2",
          color: "primary",
          icon: "warning",
          title: "Deactivate User",
          width: 600,
        }
      );
      if (res) {
        console.log("the playlist", item);
        this.$emit("deletePlaylist", item);
      }
    },
    async activeUser(item) {
      const res = await this.$confirm(
        ` <h1 class="subtitle-1">Confirm you want to actitve User 
        <span class="font-weight-bold">${item.email}</span>?</h1>`,
        {
          buttonTrueText: "Active",
          buttonFalseText: "close",
          buttonTrueColor: "red lighten-2",
          color: "primary",
          icon: "warning",
          title: "Actitve User",
          width: 600,
        }
      );
      if (res) {
        console.log("the playlist", item);
        this.$emit("deletePlaylist", item);
      }
    },
  },
  props: {
    items: Array,
    totalResults: Number,
  },
};
</script>

<style scoped>
.wrapping-td {
  white-space: normal;
}
</style>

