<template >
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
    @update:options="updateOptions">
    <v-progress-linear v-slot:progress color="blue" indeterminate></v-progress-linear>
    <template v-slot:item="{ item, headers }">
      <tr>
        <td>
          <router-link :to="`playlists/${item.uid}/companies`">
            {{
            item.name
            }}
          </router-link>
        </td>
        <td>{{ item.totalCompanies ? item.totalCompanies.toLocaleString() : "-"}}</td>
        <td>{{ item.totalScore ? item.totalScore.toLocaleString() : "0" }}</td>
        <td>
          <p>contacts coming soon</p>
        </td>
        <td>
          <router-link :to="`/advanced/${item.uid}`">Advanced</router-link>
        </td>
        <td>{{ item.userId }}</td>
        <td>{{ changeTimeHuman(item.creationTime) }}</td>
        <td>
          <a href>Add Coming soon</a>
        </td>
        <td>
          <a href>Remove Coming soon</a>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
/* import PLAYLISTS from "./Playlists.gql"; */
export default {
  data() {
    return {
      headers: [
        {
          text: "Name",
          align: "left",
          sortable: true,
          value: "name"
        },
        {
          text: "Size",
          value: "companies.length",
          align: "left"
        },
        { text: "Score", value: "scoreCount", align: "left" },
        { text: "Contacts", align: "left", value: "contacts" },
        { text: "Advanced", align: "left", value: "advanced" },
        { text: "Owner", value: "userId", align: "left" },
        { text: "Creation Time", value: "creationTime", align: "left" },
        { text: "Favorite", align: "left", value: "favorite" },
        { text: "Remove", align: "left" }
      ],
      options: {
        page: 1,
        itemsPerPage: 10
      },
    };
  },
  methods: {
    updateOptions(dataFromEvent = {}) {
      this.$emit("updateOptions", { dataFromEvent });
    },
    changeTimeHuman(time) {
      let HumanDate = time.split(".", 1).toString();
      let HumanTime = HumanDate.split("T", 2).join(" ");
      return HumanTime;
    }
  },
  props: {
    items: Array,
    totalResults: Number
  }
};
</script>
