<template>
  <div>
    <v-subheader>Companies Search</v-subheader>
    <v-form ref="simpleSearchForm" @submit.prevent>
      <v-container grid-list-xs text-xs-center>
        <v-layout row wrap>
          <v-flex xs3>
            <v-text-field name="name" v-model="company.name" label="name" @input="changeData"></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field
              name="country"
              v-model="company.country"
              label="country"
              @input="changeData"
            ></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field name="city" v-model="company.city" label="city" @input="changeData"></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field name="region" v-model="company.region" label="region" @input="changeData"></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field
              name="website"
              v-model="company.website"
              label="website"
              @input="changeData"
            ></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field name="status" v-model="company.status" label="status" @input="changeData"></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field name="state" v-model="company.state" label="state" @input="changeData"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs2>
            <v-text-field
              name="moreThanEmployees"
              v-model="company.moreThanEmployees"
              label="More than y employees"
              @input="changeData"
            ></v-text-field>
          </v-flex>
          <v-flex xs2>
            <v-text-field
              name="lessThanEmployees"
              v-model="company.lessThanEmployees"
              label="Less than x employees"
              @input="changeData"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs3>
            <v-btn @click="search" type="submit" color="primary">
              <v-icon>search</v-icon>
              {{" Do a companies Search"}}
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      company: {
        name: "",
        country: "",
        website: "",
        city: "",
        region: "",
        state: "",
        status: "",
        lessThanEmployees: "",
        moreThanEmployees: ""
      }
    };
  },
  methods: {
    changeData() {
      this.$emit("change", { ...this.company });
    },
    toggle() {
      this.$emit("toggle");
    },
    search() {
      this.toggle();
      this.$emit("search");
    }
  }
};
</script>

