<template>
  <v-container fluid>
    <v-card>
      <ApolloQuery
        :query="require('./graphql/Contact.gql')"
        :variables="{
        uid: $route.params.contactUid
      }"
      >
        <template slot-scope="{ result: { loading, error, data } }">
          <v-breadcrumbs
            v-if="data && data.contact"
            :large="true"
            :items="[
            {
              text: 'Contacts',
              disabled: false,
              href: '/contacts'
            },
            {
              text: data.contact.fullName || $route.params.contactUid,
              disable: true
            }
          ]"
            divider=">"
          >
            <template v-slot:item="props">
              <v-breadcrumbs-item
                :href="props.item.href"
                :class="[props.item.disabled && 'disabled']"
                @click.prevent="$router.push(props.item.href)"
              >{{ props.item.text }}</v-breadcrumbs-item>
            </template>
          </v-breadcrumbs>
        </template>
      </ApolloQuery>
      <v-container fluid>
          <v-row>
            <v-col lg="6" md="6" cols="12" class="py-0" >
              <contact-profile />
            </v-col>
            <v-col lg="6" md="6" cols="12" class="py-0" >
              <contact-experience />
            </v-col>
          </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>
<script>
import contactProfile from "./components/ContactProfile.vue";
import ContactExperience from "./components/ContactExperience.vue";
export default {
  data() {
    return {};
  },
  components: {
    contactProfile,
    ContactExperience
  }
};
</script>