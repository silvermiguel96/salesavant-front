<template >
<v-layout align-center justify-center column fill-height>
  <v-card>
    <v-card-title>
      <v-text-field
        label="Search similar"
        append-outer-icon="search"
      >
      </v-text-field>
    </v-card-title>
  </v-card>
  <v-card 
  auto-line-width
    class="text-xs-center ma-3"
    dark
    width="1000"
  >
    <v-card-text>
          <v-card-text>
      <div class="display-1 font-weight-thin">Article over time</div>
    </v-card-text>
      <v-sheet color="rgba(0, 0, 0, .12)">
        <v-sparkline
          :value="value"
          color="rgba(255, 255, 255, .7)"
          height="100"
          padding="24"
          stroke-linecap="round"
          smooth
        >
          <template v-slot:label="item">
            {{ item.value }}
          </template>
        </v-sparkline>
      </v-sheet>
    </v-card-text>
    <v-divider></v-divider>

    <v-card-actions class="justify-center">
      <v-btn block text>Go to Report</v-btn>
    </v-card-actions>
  </v-card>
</v-layout>
</template>
<script>
  export default {
    data: () => ({
      value: [
        2,
        10,
        7,
        15,
        48,
        39,
        35
      ]
    })
  }
</script>