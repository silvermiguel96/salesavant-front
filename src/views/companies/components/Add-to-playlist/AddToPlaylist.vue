<template>
  <v-card>
    <v-card-title>
      <h1 class="display-1">Playlists</h1>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="items"
        class="elevation-1"
      >
      <template v-slot:items="props">
        <td>{{ props.item.name }}</td>
        <td>
          <v-icon
            small
            class="mr-2"
            @click="deleteItem(props.item)"
          >
          delete
          </v-icon>
        </td>
      </template>
      </v-data-table>
    </v-card-text>
    <!-- Add Playlist -->
 <v-card-text class="ma-3">
      <v-layout row v-for="signal in items" :key="signal.id">
          <v-flex sm4>
            <h4> {{ signal.name }}</h4>
          </v-flex>
          <v-flex sm3>
            <v-btn small>
              <v-icon samll left >add</v-icon>
              Add
            </v-btn>
          </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data () {
    return {
      headers: [
        { text: 'Playlist', value: 'name' },
        { text: 'Action'}
      ]
    } 
  },
  props: {
      items: Array,
      props: []
  },
  methods: {
    deleteItem (item) {
    }
  }
}
</script>
