<template>
  <v-form ref="newsSearchForm" @submit.prevent>
    <v-container grid-list-md text-xs-center>
      <v-layout row wrap>
        <v-flex>
          <v-text-field 
            name="news" 
            v-model="newsSearch" 
            label="Search in news" 
            autocomplete="off"></v-text-field>
        </v-flex>
        <v-flex d-flex align-center justify-center>
          <v-btn @click="search" small class="text-capitalize" type="submit" color="primary">
            <v-icon class="pr-1" small>search</v-icon>
            {{"news search"}}
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      newsSearch: ""
    };
  },
  methods: {
    ...mapMutations([
      'doNewsSearch'
    ]),
    search() {
      console.log(this.$route.path);
      if (this.$route.path !== "/news"){
        this.$router.push("/news");
      }
      this.doNewsSearch({...this.newsSearch});
    }
  }
};
</script>

