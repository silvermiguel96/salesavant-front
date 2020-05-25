<template>
  <v-container fluid class="py-0">
    <v-row>
      <v-col md="6" xs="12" class="px-0 py-0 pb-1 pr-sm-3 pb-sm-0">
        <v-card v-if="company" style="height:100%;" class="pa-3">
          <v-row no-gutters>
            <v-col cols="12">
              <v-card-text>
              <div class="title text-capitalize font-weight-regular grey--text">Website Text</div>
                <v-row no-gutters>
                  <v-col cols="12" class="pr-2" >
                    <long-paragraph
                      class="font-weight-light text-justify pt-1"
                      :text="company.website"
                      :maxLength="1500"
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
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="filter_list"
                label="Quick Search"
                placeholder="Type a Keyword"
                hide-details
              ></v-text-field>
              <v-data-table :headers="headers" :items="httpCompany" :search="search" dense>
                <template v-slot:item="{ item }">
                  <tr>
                    <td>
                        {{ item.linkLabel}}
                    </td>
                    <td>
                      <a
                        v-if="item"
                        :key="`news-external-link${item.url || ''}`"
                        :href="item.url"
                        target="_blank"
                      >
                        <long-paragraph
                          class="font-weight-light text-justify"
                          :text="item.url"
                          :maxLength="60"
                        ></long-paragraph>
                      </a>
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
      search: "",
      headers: [
        { text: "Names", value: "linkLabel", sortable: true , width: "20%" },
        { text: "Links", value: "url", sortable: false , width: "80%"}
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
            website
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
      return this.company.websiteLinks.map(website => {
        if (website.link.startsWith("http")) {
          return { url: website.link, linkLabel: website.linkLabel };
        } else {
          return {
            url: `${website.url}+${website.link}`,
            linkLabel: website.linkLabel
          };
        }
      });
      console.log("https", https);
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