<template>
  <v-card v-if="company">
    <v-card-title>
      <div class="headline">Profile</div>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <div class="subtitle-2 font-weight-bold">
        Company:
        <span class="caption">{{ company.name || "[empty name]" }}</span>
      </div>
    </v-card-text>
    <v-card-text>
      <h3 class="subtitle-2 font-weight-bold">
        Momentum:
        <span class="caption">{{ company.momentum || "--" }}</span>
      </h3>
    </v-card-text>
    <v-card-text>
      <h3 class="subtitle-2 font-weight-bold">
        Signals Score:
        <span class="caption">{{ company.totalScore || "--" }}</span>
      </h3>
    </v-card-text>
    <v-card-text>
      <h3 class="subtitle-2 font-weight-bold">
        Total signals:
        <span class="caption">{{ company.totalSignals || "--" }}</span>
      </h3>
    </v-card-text>
    <v-card-text>
      <h3 class="subtitle-2 font-weight-bold">
        Website keywords
        <span class="caption">{{ company.website || "--" }}</span>
      </h3>
    </v-card-text>
    <v-card-text>
      <h3 class="subtitle-2 font-weight-bold">
        Vertical Groups:
        <span class="caption">{{ company.vertical || "--" }}</span>
      </h3>
    </v-card-text>
    <v-card-text>
      <h3 class="subtitle-2 font-weight-bold">
        Industry:
        <span class="caption">{{ company.industry || "--" }}</span>
      </h3>
    </v-card-text>
    <v-card-text>
      <h3 class="subtitle-2 font-weight-bold">
        Other Vertical ???:
        <span class="caption">--</span>
      </h3>
    </v-card-text>
    <v-card-text>
      <h3 class="subtitle-2 font-weight-bold">
        Description:
        <long-paragraph
          class="caption text-justify"
          :text="company.description"
          :maxLength="100"
        ></long-paragraph>
      </h3>
    </v-card-text>
    <v-card-text>
      <td></td>
      <h3 class="caption font-weight-bold">
        Website:
        <a
          v-if="company.url"
          :key="`news-external-link${company.url || ''}`"
          :href="httpCompany"
          target="_blank"
          >{{ company.url }}</a
        >
        <span v-else>--</span>
      </h3>
    </v-card-text>
    <v-card-text>
      <h3 class="caption font-weight-bold">
        More key words:
        <v-btn small color="info" :disabled="true">Analyze website</v-btn>
      </h3>
    </v-card-text>
    <v-card-text>
      <h3 class="subtitle-2 font-weight-bold">
        City:
        <span class="caption">{{ company.city || "--" }}</span>
      </h3>
    </v-card-text>
    <v-card-text>
      <h3 class="subtitle-2 font-weight-bold">
        State:
        <span class="caption">{{ company.state || "--" }}</span>
      </h3>
    </v-card-text>
    <v-card-text>
      <h3 class="subtitle-2 font-weight-bold">
        Country:
        <span class="caption">{{ company.country || "--" }}</span>
      </h3>
    </v-card-text>
    <v-card-text>
      <h3 class="subtitle-2 font-weight-bold">
        Num Employess:
        <span class="caption">{{ company.numEmployees || "--" }}</span>
      </h3>
    </v-card-text>
    <v-card-text>
      <h3 class="subtitle-2 font-weight-bold">
        Status :
        <span class="caption">{{ company.status || "--" }}</span>
      </h3>
    </v-card-text>
    <v-card-text>
      <h3 class="subtitle-2 font-weight-bold">
        NAICS code :
        <span class="caption" v-if="company.naics">{{
          company.naics.code || "--"
        }}</span>
      </h3>
    </v-card-text>
    <v-card-text>
      <h3 class="subtitle-2 font-weight-bold">
        NAICS description :
        <span class="caption" v-if="company.naics">{{
          company.naics.description || "--"
        }}</span>
      </h3>
    </v-card-text>
    <v-card-text>
      <h3 class="subtitle-2 font-weight-bold">
        Funding ???:
        <span class="caption">--</span>
      </h3>
    </v-card-text>
  </v-card>
</template>

<script>
import LongParagraph from "../../../../components/common/LongParagraph";
import gql from "graphql-tag";
export default {
  data() {
    return {
      company: null
    };
  },
  components: {
    LongParagraph
  },
  computed: {
    httpCompany: function() {
      return this.company.url.startsWith("http")
        ? this.company.url
        : `http://${this.company.url}`;
    }
  },
  apollo: {
    company: {
      query: gql`
        query getSingleCompany($uid: String) {
          company(uid: $uid) {
            uid
            name
            momentum
            vertical
            description
            url
            city
            state
            country
            numEmployees
            status
            totalScore
            totalSignals
            industry
            naicsCode
            website
            naics {
              search
              description
              code
            }
          }
        }
      `,
      variables() {
        return {
          uid: this.$route.params.companiesUid
        };
      },
      fetchPolicy: "cache-and-network"
    }
  },
  beforeCreate() {
    this.$apollo.queries.company;
  }
};
</script>

<style scoped>
.v-card__text {
  padding: 0.5em;
  padding-left: 1em;
}
</style>
