<template>
      <v-card>
        <v-card-title>
          <h1 class="display-1">Profile</h1>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <h5 class="subheading font-weight-bold">
            Company: <span class="body-1">{{ items.name }}</span>
          </h5>
        </v-card-text>
        <v-card-text>
          <h3 class="subheading font-weight-bold">
            Momentum: <span class="body-1">{{ items.momentum }}</span>
          </h3>
        </v-card-text>
        <v-card-text>
          <h3 class="subheading font-weight-bold">
            New Score: <span class="subheading"> New Score is Comming</span>
          </h3>
        </v-card-text>
        <v-card-text>
          <h3 class="subheading font-weight-bold">
            Vertical Groups:
            <span class="subheading">{{ items.vertical }}</span>
          </h3>
        </v-card-text>
        <v-card-text>
          <h3 class="subheading font-weight-bold">
            Tecnology of services:
            <span class="subheading">Tecnology of services is Comming</span>
          </h3>
        </v-card-text>
        <v-card-text>
          <h3 class="subheading font-weight-bold">
            Other Vertical:
            <span class="subheading">Other Vertical is Comming</span>
          </h3>
        </v-card-text>
        <v-card-text>
          <h3 class="subheading font-weight-bold">
            Description: <span class="subheading">{{ items.description }}</span>
          </h3>
        </v-card-text>
        <v-card-text>
          <h3 class="subheading font-weight-bold">
            Website:
            <a :href="`${items.url}`" class="subheading">{{ items.url }}</a>
          </h3>
        </v-card-text>
        <v-card-text>
          <h3 class="subheading font-weight-bold">
            City: <span class="subheading">{{ items.city }}</span>
          </h3>
        </v-card-text>
        <v-card-text>
          <h3 class="subheading font-weight-bold">
            State: <span class="subheading">{{ items.state }}</span>
          </h3>
        </v-card-text>
        <v-card-text>
          <h3 class="subheading font-weight-bold">
            Country: <span class="subheading">{{ items.country }}</span>
          </h3>
        </v-card-text>
        <v-card-text>
          <h3 class="subheading font-weight-bold">
            Num Employess:
            <span class="subheading">{{ items.numEmployees }}</span>
          </h3>
        </v-card-text>
        <v-card-text>
          <h3 class="subheading font-weight-bold">
            Status : <span class="subheading">{{ items.status }}</span>
          </h3>
        </v-card-text>
        <v-card-text>
          <h3 class="subheading font-weight-bold">
            Funding: <span class="subheading">Funding is comming</span>
          </h3>
        </v-card-text>
      </v-card>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    items: Array,
    props: []
  }
};
</script>

<style scoped>
.v-card__text {
  padding: 0.5em;
  padding-left: 1em;
}
</style>
