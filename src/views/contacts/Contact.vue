<template>
  <v-container fluid>
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
      <v-tabs grow background-color="grey lighten-5" color="primary">
        <!-- Tab Home -->
        <v-tab class="text-capitalize">Profile</v-tab>
        <v-tab-item>
          <v-container fluid class="pt-0">
            <v-row>
              <v-col lg="6" md="5" cols="12" class="py-0">
                <contact-profile />
              </v-col>
              <v-col lg="6" md="7" cols="12" class="py-0">
                <contact-experience />
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>
        <!-- tab comments -->
        <v-tab class="text-capitalize">Comments</v-tab>
        <v-tab-item>
          <contact-comments />
        </v-tab-item>
      </v-tabs>
  </v-container>
</template>
<script>
import contactProfile from "../../components/contacts/contact/ContactProfile";
import contactExperience from "../../components/contacts/contact/ContactExperience.vue";
import contactComments from "../../components/contacts/contact/Comments.vue";
export default {
  data() {
    return {};
  },
  components: {
    contactProfile,
    contactExperience,
    contactComments
  }
};
</script>