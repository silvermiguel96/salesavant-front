<template>
  <v-card>
    <v-card-title>
      <h1 class="display-1">Custom Sales Signals</h1>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-actions default>
      <v-icon large color="blue">info</v-icon>
      <h2 class="headline font-weight-bold">Custome Score:</h2>
      <p class="headline">New score comming soon</p>
    </v-card-actions>
    <v-card-text>
      <!-- The first table -->
      <v-data-table 
      :headers="headers2"
      :items="desserts2"
      class="elevation-1"
      hide-actions>
        <template v-slot:items="props">
          <td >{{ props.item.group }}</td>
          <td >{{ props.item.total }}</td>
          <td class="text-xs-right">{{ props.item.score }}</td>
        </template>
      </v-data-table>
      <v-divider></v-divider>
      <!-- Second Table -->
      <v-data-table
        :headers="headers"
        :items="desserts"
        class="elevation-1"
        hide-actions
      >
      <template v-slot:items="props">
        <td>{{ props.item.group }}</td>
        <td>{{ props.item.signal }}</td>
        <td>{{ props.item.score }}</td>
        <td class="justify-center layout px-0">
          <v-icon
            small
            @click="deleteItem(props.item)"
          >
            delete
          </v-icon>
        </td>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>
    </v-data-table>
    </v-card-text>
    <!-- Add Signal -->
    <v-card-text>
      <v-layout row>
        <v-flex md9 lg10>
          <v-text-field
            label="Add a signal">
          </v-text-field>
        </v-flex>
        <v-flex sm3 lg2>
          <v-btn>
            <v-icon left >add</v-icon>
            Add
          </v-btn>
        </v-flex>
      </v-layout>
      <v-layout row v-for="signal in listsignal" :key="signal.id">
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
    <!-- List singal -->
    <v-card-text>
      <v-data-table
        :headers="Hkeywords"
        hide-actions>
      </v-data-table>
      <template>
        <td></td>
      </template>
    </v-card-text>
  </v-card>
</template>
<script>
  export default {
    data: () => ({
        headers2: [
          {
            text: 'Group',
            value: 'group'
          },
          { text: 'Total', value: 'total' },
          { text: 'Score', value: 'score', align: 'right',},
        ],
        desserts2: [
          {
            group: 'Group is CS',
            total: 'total 2',
            score: 'Score is CS',
          },
          {
            group: 'Group is CS',
            total: 'total 3',
            score: 'Score is CS',
          }
        ],
      headers: [
        {
          text: 'Group',
          align: 'left',
          value: 'group'
        },
        { text: 'Signal', value: 'signal' },
        { text: 'Score', value: 'score' },
        { text: 'Actions', value: 'name', sortable: false }
      ],
      desserts: [],
      listsignal: [
        { name: "Customer"},
        { name: "High Momentum "},
        { name: "Crossborder Acquisition Prospect"},
        { name: "Marketo Customers 2"}
      ]
      ,
      Hkeywords: [
        {
        text: 'Keywords',value: 'ketwords'
        },
        {
          text: 'Score', value: 'score'
        }
      ]
    }),
    created () {
      this.initialize()
    },

    methods: {
      initialize () {
        this.desserts = [
          {
            group: 'None',
            signal: 'High Momentum',
            score: 1,
          },
          {
            group: 'None',
            signal: 'High Momentum',
            score: 2,
          },
        ]
      },
      deleteItem (item) {
        const index = this.desserts.indexOf(item)
        confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
      },
    }
  }
</script>
<style scoped>
.v-card__actions {
  margin: 1em;
}
</style>
