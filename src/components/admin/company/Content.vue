<template>
  <v-container fluid class="py-0">
    <v-row>
      <v-col md="6" xs="12" class="px-0 py-0 pb-1 pr-sm-3 pb-sm-0">
        <v-card v-if="company" style="height:100%;" class="pa-3">
          <v-card-text>
            <div class="subtitle-1 text-capitalize font-weight-medium">Website Text</div>
            <long-paragraph
              class="font-weight-normal text-justify mt-4"
              :text="company.website"
              :maxLength="1500"
            ></long-paragraph>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col md="6" xs="12" class="px-0 py-0">
        <v-card v-if="company" style="height:100%;" class="pa-3">
          <v-card-text>
            <div class="subtitle-1 text-capitalize font-weight-medium">Web Site Links</div>
            <v-text-field
              v-model="search"
              append-icon="filter_list"
              label="Quick Search"
              placeholder="Type a Keyword"
              class="pt-3"
              hide-details
              autocomplete="off"
              clearable
            ></v-text-field>
            <v-row justify="center" no-gutters>
              <v-col cols="12">
                <v-data-table
                  :headers="headers"
                  :items="httpCompany"
                  :search="search"
                  class="mt-4"
                  dense
                >
                  <template v-slot:item="{ item }">
                    <tr>
                      <td>{{ item.linkLabel || '--' }}</td>
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
                            :maxLength="35"
                          ></long-paragraph>
                        </a>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
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
        { text: "Label", value: "linkLabel", sortable: false, width: "40%" },
        { text: "Link", value: "url", sortable: false, width: "60%" },
      ],
    };
  },
  components: {
    LongParagraph,
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
          uid: this.$route.params.companiesUid,
        };
      },
      fetchPolicy: "no-cache",
    },
  },
  computed: {
    httpCompany: function () {
      return this.company.websiteLinks.map((website) => {
        if (website.link.startsWith("http")) {
          return { url: website.link, linkLabel: website.linkLabel };
        } else {
          return {
            url: `${website.url}+${website.link}`,
            linkLabel: website.linkLabel,
          };
        }
      });
      console.log("https", https);
    },
  },
  beforeCreate() {
    this.$apollo.queries.company;
    this.$apollo.queries.companySignals;
  },
};
</script>

<style scoped>
.v-card__text {
  padding: 0.5em;
  padding-left: 1em;
}
</style>