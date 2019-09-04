  <template>
  <v-card v-if="company">
    <v-card-title>
      <h1 class="display-1">Profile</h1>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <h5 class="subheading font-weight-bold">
        Company:
        <span class="body-1">{{ company.name || '[empty name]' }}</span>
      </h5>
    </v-card-text>
    <v-card-text>
      <h3 class="subheading font-weight-bold">
        Momentum:
        <span class="body-1">{{ company.momentum || '--' }}</span>
      </h3>
    </v-card-text>
    <v-card-text>
      <h3 class="subheading font-weight-bold">
        Signals Score:
        <span class="subheading">{{company.totalScore || '--'}}</span>
      </h3>
    </v-card-text>
    <v-card-text>
      <h3 class="subheading font-weight-bold">
        News Score ???:
        <span class="subheading">--</span>
      </h3>
    </v-card-text>
    <v-card-text>
      <h3 class="subheading font-weight-bold">
        Total signals:
        <span class="subheading">{{company.totalSignals || '--'}}</span>
      </h3>
    </v-card-text>
    <v-card-text>
      <h3 class="subheading font-weight-bold">
        Website keywords
        <span class="subheading">{{company.website || '--'}}</span>
      </h3>
    </v-card-text>
    <v-card-text>
      <h3 class="subheading font-weight-bold">
        Vertical Groups:
        <span class="subheading">{{ company.vertical || '--' }}</span>
      </h3>
    </v-card-text>
    <v-card-text>
      <h3 class="subheading font-weight-bold">
        Industry:
        <span class="subheading">{{company.industry || '--'}}</span>
      </h3>
    </v-card-text>
    <v-card-text>
      <h3 class="subheading font-weight-bold">
        Other Vertical ???:
        <span class="subheading">--</span>
      </h3>
    </v-card-text>
    <v-card-text>
      <h3 class="subheading font-weight-bold">
        Description:
        <span class="subheading">{{ company.description || '--' }}</span>
      </h3>
    </v-card-text>
    <v-card-text>
      <td></td>
      <h3 class="subheading font-weight-bold">
        Website:
        <a
          v-if="company.url"
          :key="`news-external-link${company.url || ''}`"
          :href="httpCompany"
          target="_blank"
        >{{ company.url }}</a>
        <span v-else>--</span>
      </h3>
    </v-card-text>
    <v-card-text>
      <h3 class="subheading font-weight-bold">
        More key words:
        <v-btn small color="info" :disabled="true">Analyze website</v-btn>
      </h3>
    </v-card-text>
    <v-card-text>
      <h3 class="subheading font-weight-bold">
        City:
        <span class="subheading">{{ company.city || '--' }}</span>
      </h3>
    </v-card-text>
    <v-card-text>
      <h3 class="subheading font-weight-bold">
        State:
        <span class="subheading">{{ company.state || '--' }}</span>
      </h3>
    </v-card-text>
    <v-card-text>
      <h3 class="subheading font-weight-bold">
        Country:
        <span class="subheading">{{ company.country || '--' }}</span>
      </h3>
    </v-card-text>
    <v-card-text>
      <h3 class="subheading font-weight-bold">
        Num Employess:
        <span class="subheading">{{ company.numEmployees || '--' }}</span>
      </h3>
    </v-card-text>
    <v-card-text>
      <h3 class="subheading font-weight-bold">
        Status :
        <span class="subheading">{{ company.status || '--' }}</span>
      </h3>
    </v-card-text>
    <v-card-text>
      <h3 class="subheading font-weight-bold">
        NAICS code :
        <span class="subheading" v-if="company.naics">{{ company.naics.code || '--' }}</span>
      </h3>
    </v-card-text>
    <v-card-text>
      <h3 class="subheading font-weight-bold">
        NAICS description :
        <span
          class="subheading"
          v-if="company.naics"
        >{{ company.naics.description || '--' }}</span>
      </h3>
    </v-card-text>
    <v-card-text>
      <h3 class="subheading font-weight-bold">
        Funding ???:
        <span class="subheading">--</span>
      </h3>
    </v-card-text>
  </v-card>
</template>

<script>
import gql from "graphql-tag";
export default {
  data() {
    return {
      company: null,

    };
  },
  computed: {
    httpCompany: function () {
      return this.company.url.startsWith("http") ? this.company.url :  `http://${this.company.url}`;
    },
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
