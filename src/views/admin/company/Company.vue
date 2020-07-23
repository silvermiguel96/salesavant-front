<template>
  <v-container fluid>
    <v-card>
      <v-row no-gutters>
        <v-col cols="12" xs="2" class="pt-0">
          <v-breadcrumbs
            :large="true"
            :items="[
            {
              text: 'Admin Company',
              disabled: false,
              href: '/companies-admin'
            },
            {
              text: company.name || $route.params.companiesUid,
              disable: true
            }    
          ]"
            divider=">"
            class="pl-3 pl-sm-6 pb-0"
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
        <v-col cols="12">
          <div class="title text--secondary pl-3 pl-sm-6">{{ company.name || '' }}</div>
          <div class="caption text--secondary pl-3 pl-sm-6">
            Last Updated:
            <span
              v-if="company.modificationTime"
            >{{ company.modificationTime | moment("from", "now") }}</span>
          </div>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" xs="12" class="pt-0">
          <v-tabs grow background-color="grey lighten-5" color="primary">
            <!-- Tab Home -->
            <v-tab class="text-capitalize">Summary</v-tab>
            <v-tab-item>
              <v-container fluid class="pa-0">
                <company-profile />
              </v-container>
            </v-tab-item>
            <!-- Tab add to Content -->
            <v-tab class="text-capitalize">Content</v-tab>
            <v-tab-item>
              <Content></Content>
            </v-tab-item>
          </v-tabs>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
// Home
import CompanyProfile from "../../../components/admin/company/CompanyProfile.vue";
// Content
import Content from "../../../components/admin/company/Content.vue";

export default {
  data() {
    return {
      company: {},
    };
  },
  components: {
    CompanyProfile,
    Content,
  },
  apollo: {
    company: {
      query: gql`
        query getCompany($companyUid: String) {
          company(uid: $companyUid) {
            uid
            name
            url
            description
            creationTime
            modificationTime
            totalScore
          }
        }
      `,
      variables() {
        return {
          companyUid: this.$route.params.companiesUid,
        };
      },
      fetchPolicy: "cache-and-network",
    },
  },
};
</script>
