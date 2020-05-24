<template>
  <v-container fluid class="py-0">
    <v-row>
      <v-col md="6" xs="12" class="px-0 py-0 pb-1 pr-sm-3 pb-sm-0">
        <v-card v-if="company" style="height:100%;" class="pa-3">
          <v-row no-gutters>
            <v-col cols="12">
              <v-card-text>
                <v-row no-gutters>
                  <v-col cols="12">
                    <div class="subtitle-2 font-weight-medium">Description:</div>
                  </v-col>
                  <v-col cols="12" class="pr-2">
                    <long-paragraph
                      class="font-weight-light text-justify"
                      :text="company.content"
                      :maxLength="100"
                    ></long-paragraph>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col md="6" xs="12" class="px-0 py-0">
        <v-card v-if="company" style="height:100%;" class="pa-3">
          <v-card-text>
            <!-- The first table -->
            <div>
              <div class="title text-capitalize font-weight-regular grey--text">Web Site Links</div>
              <v-data-table
                v-if="company && httpCompany"
                :headers="headers"
                :items="httpCompany"
                dense
              >
                <template v-slot:item="{ item }">
                  <tr>
                    <td>
                      <long-paragraph
                        class="font-weight-light text-justify"
                        :text="item.linkLabel"
                        :maxLength="40"
                      ></long-paragraph>
                    </td>
                    <td>
                      <a
                        v-if="item"
                        :key="`news-external-link${item.website || ''}`"
                        :href="item.website"
                        target="_blank"
                      >Link</a>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LongParagraph from "../../common/LongParagraph.vue";
import gql from "graphql-tag";
export default {
  data() {
    return {
      company: null,
      headers: [
        { text: "Names", value: "name", sortable: false },
        { text: "Links", value: "link", sortable: false }
      ]
    };
  },
  components: {
    LongParagraph
  },
  apollo: {
    company: {
      query: gql`
        query getCompanyWebSite($uid: String) {
          company(uid: $uid) {
            uid
            name
            url
            websiteLinks {
              url
              linkLabel
              link
            }
          }
        }
      `,
      variables() {
        return {
          uid: this.$route.params.companiesUid
        };
      },
      fetchPolicy: "no-cache"
    }
  },
  computed: {
    httpCompany: function() {
      return  this.company.websiteLinks.map(website => {
        console.log("website", website.link.startsWith('http'));
        if (website.link.startsWith("http")) {
          return  {website: website.link, linkLabel: website.linkLabel};
        } else {
          return  {website: `${website.url}+${website.link}`, linkLabel: website.linkLabel};;
        }
      });
      console.log("https", https)

    }
  },
  beforeCreate() {
    this.$apollo.queries.company;
    this.$apollo.queries.companySignals;
  }
};
</script>

<style scoped>
.v-card__text {
  padding: 0.5em;
  padding-left: 1em;
}
</style>