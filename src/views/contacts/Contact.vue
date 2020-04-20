<template>
  <v-container fluid>
    <v-card>
      <v-row no-gutters>
        <v-col cols="12" xs="2" class="pt-0">
          <v-breadcrumbs
            :large="true"
            :items="[
            {
              text: 'Contacts',
              disabled: false,
              href: '/contacts'
            },
            {
              text: contact.fullName || $route.params.contactUid,
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
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="8" md="8" lg="10">
          <div class="title text--secondary pl-3 pl-sm-6">{{ contact.fullName || '' }}</div>
          <div class="caption text--secondary pl-3 pl-sm-6">
            Last Updated:
            <span
              v-if="contact.modificationTime"
            >{{ contact.modificationTime | moment("from", "now") }}</span>
          </div>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" xs="12" class="pt-0">
          <v-tabs grow background-color="grey lighten-5" color="primary">
            <!-- Tab Home -->
            <v-tab class="text-capitalize">Profile</v-tab>
            <v-tab-item>
              <v-container fluid class="py-0">
                <v-row>
                  <v-col md="6" xs="12" class="px-0 py-0 pb-1 pr-sm-3 pb-sm-0">
                    <contact-profile />
                  </v-col>
                  <v-col md="6" xs="12" class="px-0 py-0">
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
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
<script>
import gql from "graphql-tag";
import contactProfile from "../../components/contacts/contact/ContactProfile.vue";
import contactExperience from "../../components/contacts/contact/ContactExperience.vue";
import contactComments from "../../components/contacts/contact/Comments.vue";
export default {
  data() {
    return {
      contact: {}
    };
  },
  components: {
    contactProfile,
    contactExperience,
    contactComments
  },
  apollo: {
    contact: {
      query: gql`
        query getContact($contactUid: String) {
          contact(uid: $contactUid) {
            creationTime
            modificationTime
            uid
            fullName
          }
        }
      `,
      variables() {
        return {
          contactUid: this.$route.params.contactUid
        };
      },
      fetchPolicy: "cache-and-network"
    }
  }
};
</script>