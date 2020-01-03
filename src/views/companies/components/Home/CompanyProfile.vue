<template>
  <v-card v-if="company">
    <v-card-title>
      <div class="headline">Profile</div>
    </v-card-title>
    <v-divider></v-divider>
    <v-row no-gutters>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-none d-md-block" no-gutters>
            <v-col cols="12" xs="6">
              <div class="subtitle-2 font-weight-medium">Company</div>
            </v-col>
            <v-col cols="12" xs="6">
              <span class="body-2">{{ company.name || "[empty name]" }}</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-sm-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Company:</span>
                <span class="body-2 float-right">{{ company.name || "[empty name]" }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-none d-md-block" no-gutters>
            <v-col cols="12" xs="6">
              <div class="subtitle-2 font-weight-medium">Website</div>
            </v-col>
            <v-col cols="12" xs="6">
              <a
                v-if="company.url"
                :key="`news-external-link${company.url || ''}`"
                :href="httpCompany"
                target="_blank"
              >{{ company.url }}</a>
              <span v-else>--</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-sm-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Website:</span>
                <span class="body-2 float-right">
                  <a
                    v-if="company.url"
                    :key="`news-external-link${company.url || ''}`"
                    :href="httpCompany"
                    target="_blank"
                  >{{ company.url }}</a>
                  <span v-else>--</span>
                </span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-none d-md-block" no-gutters>
            <v-col cols="12" xs="6">
              <div class="subtitle-2 font-weight-medium">Vertical Groups</div>
            </v-col>
            <v-col cols="12" xs="6">
              <span class="body-2">{{ company.vertical || "--" }}</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-sm-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Vertical Groups:</span>
                <span class="body-2 float-right">{{ company.vertical || "--" }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-none d-md-block" no-gutters>
            <v-col cols="12" xs="6">
              <div class="subtitle-2 font-weight-medium">Industry</div>
            </v-col>
            <v-col cols="12" xs="6">
              <span class="body-2">{{ company.industry || "--" }}</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-sm-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Industry:</span>
                <span class="body-2 float-right">{{ company.industry || "--" }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-none d-md-block" no-gutters>
            <v-col cols="12" xs="6">
              <div class="subtitle-2 font-weight-medium">Status</div>
            </v-col>
            <v-col cols="12" xs="6">
              <span class="body-2">{{ company.status || "--" }}</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-sm-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Status:</span>
                <span class="body-2 float-right">{{ company.status || "--" }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-none d-md-block" no-gutters>
            <v-col cols="12" xs="6">
              <div class="subtitle-2 font-weight-medium">Momentum</div>
            </v-col>
            <v-col cols="12" xs="6">
              <span class="body-2">{{ company.momentum || "--" }}</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-sm-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Momentum:</span>
                <span class="body-2 float-right">{{ company.momentum || "--" }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-none d-md-block" no-gutters>
            <v-col cols="12" xs="6">
              <div class="subtitle-2 font-weight-medium">Country</div>
            </v-col>
            <v-col cols="12" xs="6">
              <span class="body-2">{{ company.country || "--" }}</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-sm-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Country:</span>
                <span class="body-2 float-right">{{ company.country || "--" }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-none d-md-block" no-gutters>
            <v-col cols="12" xs="6">
              <div class="subtitle-2 font-weight-medium">State</div>
            </v-col>
            <v-col cols="12" xs="6">
              <span class="body-2">{{ company.state || "--" }}</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-sm-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">State:</span>
                <span class="body-2 float-right">{{ company.state || "--" }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-none d-md-block" no-gutters>
            <v-col cols="12" xs="6">
              <div class="subtitle-2 font-weight-medium">City</div>
            </v-col>
            <v-col cols="12" xs="6">
              <span class="body-2">{{ company.city || "--" }}</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-sm-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">City:</span>
                <span class="body-2 float-right">{{ company.city || "--" }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-none d-md-block" no-gutters>
            <v-col cols="12" xs="6">
              <div class="subtitle-2 font-weight-medium">Employees</div>
            </v-col>
            <v-col cols="12" xs="6">
              <span class="body-2">{{ company.numEmployees || "--" }}</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-sm-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Employees:</span>
                <span class="body-2 float-right">{{ company.numEmployees || "--" }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-none d-md-block" no-gutters>
            <v-col cols="12" xs="6">
              <div class="subtitle-2 font-weight-medium">NAICS Code</div>
            </v-col>
            <v-col cols="12" xs="6">
              <span class="body-2" v-if="company.naics">{{ company.naics.code || "--" }}</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-sm-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">NAICS Code:</span>
                <span
                  class="body-2 float-right"
                  v-if="company.naics"
                >{{ company.naics.code || "--" }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-none d-md-block" no-gutters>
            <v-col cols="12" xs="6">
              <div class="subtitle-2 font-weight-medium">NAICS Description:</div>
            </v-col>
            <v-col cols="12" xs="6">
              <span class="body-2" v-if="company.naics">{{ company.naics.description || "--" }}</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-sm-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Employees:</span>
                <span
                  class="body-2 float-right"
                  v-if="company.naics"
                >{{ company.naics.description || "--" }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12">
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12">
              <div class="subtitle-2 font-weight-medium">Description:</div>
            </v-col>
            <v-col cols="12">
              <long-paragraph
                class="body-2 text-justify"
                :text="company.description"
                :maxLength="100"
              ></long-paragraph>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12">
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12">
              <div class="subtitle-2 font-weight-medium">Keywords:</div>
            </v-col>
            <v-col cols="12">
              <long-paragraph class="body-2 text-justify" :text="company.website" :maxLength="100"></long-paragraph>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
    </v-row>
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
