<template>
  <div>
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
        <v-col md="5" xs="12" class="pt-0">
          <contact-profile />
        </v-col>
        <v-col md="7" xs="12" class="pt-0">
          <contact-experience />
        </v-col>
      </v-row>
    </v-container>
  </div>
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