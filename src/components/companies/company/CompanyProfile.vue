<template>
  <v-card v-if="company" style="height:100%;" class="pa-3">
        <v-row no-gutters>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-none d-md-block" no-gutters>
            <v-col cols="12" xs="6">
              <div class="subtitle-2 font-weight-medium">Website</div>
            </v-col>
            <v-col cols="12" xs="6">
              <!-- <span class="font-weight-light">{{ company.website || "--" }}</span> -->
              <a
                v-if="company.url"
                :key="`news-external-link${company.url || ''}`"
                :href="httpCompany"
                target="_blank"
              >{{ company.url || "--"}}</a>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Website:</span>
                <span class="font-weight-light float-right">{{ company.Website || "--" }}</span>
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
              <span class="font-weight-light">{{ company.momentum || "--" }}</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Momentum:</span>
                <span class="font-weight-light float-right">{{ company.momentum || "--" }}</span>
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
              <span class="font-weight-light">{{ company.vertical || "--" }}</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Vertical Groups:</span>
                <span class="font-weight-light float-right">{{ company.vertical || "--" }}</span>
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
              <span class="font-weight-light">{{ company.industry || "--" }}</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Industry:</span>
                <span class="font-weight-light float-right">{{ company.industry || "--" }}</span>
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
              <span class="font-weight-light">{{ company.country || "--" }}</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Country:</span>
                <span class="font-weight-light float-right">{{ company.country || "--" }}</span>
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
              <span class="font-weight-light">{{ company.state || "--" }}</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">State:</span>
                <span class="font-weight-light float-right">{{ company.state || "--" }}</span>
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
              <span class="font-weight-light">{{ company.city || "--" }}</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">City:</span>
                <span class="font-weight-light float-right">{{ company.city || "--" }}</span>
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
              <span class="font-weight-light">{{ company.numEmployees || "--" }}</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Employees:</span>
                <span class="font-weight-light float-right">{{ company.numEmployees || "--" }}</span>
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
              <div class="subtitle-2 font-weight-medium">NAICS Code:</div>
            </v-col>
            <v-col cols="12" xs="6">
              <span class="font-weight-light" v-if="company.naics">{{ company.naics.code || "--" }}</span>
              <span class="font-weight-light" v-else>--</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">NAICS Code:</span>
                <span
                  class="font-weight-light float-right"
                  v-if="company.naics"
                >{{ company.naics.code || "--" }}</span>
              <span class="font-weight-light float-right" v-else>--</span>
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
              <span class="font-weight-light" v-if="company.naics">{{ company.naics.description || "--" }}</span>
              <span class="font-weight-light" v-else>--</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">NAICS Description::</span>
                <span
                  class="font-weight-light float-right"
                  v-if="company.naics"
                >{{ company.naics.description || "--" }}</span>
              <span class="font-weight-light float-right" v-else>--</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-none d-md-block" no-gutters>
            <v-col cols="12" xs="6">
              <div class="subtitle-2 font-weight-medium">Scale Score:</div>
            </v-col>
            <v-col cols="12" xs="6">
              <span class="font-weight-light" v-if="company.scaleScore">{{ company.scaleScore || "--" }}</span>
              <span class="font-weight-light" v-else>--</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Scale Score:</span>
                <span
                  class="font-weight-light float-right"
                  v-if="company.scaleScore"
                >{{ company.scaleScore || "--" }}</span>
              <span class="font-weight-light float-right" v-else>--</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-none d-md-block" no-gutters>
            <v-col cols="12" xs="6">
              <div class="subtitle-2 font-weight-medium">Capital Efficiency Score:</div>
            </v-col>
            <v-col cols="12" xs="6">
              <span class="font-weight-light" v-if="company.capitalEfficiencyScore">{{ company.capitalEfficiencyScore || "--" }}</span>
              <span class="font-weight-light" v-else>--</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Capital Efficiency Score:</span>
                <span
                  class="font-weight-light float-right"
                  v-if="company.capitalEfficiencyScore"
                >{{ company.capitalEfficiencyScore || "--" }}</span>
              <span class="font-weight-light float-right" v-else>--</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-none d-md-block" no-gutters>
            <v-col cols="12" xs="6">
              <div class="subtitle-2 font-weight-medium">Acquirer Name:</div>
            </v-col>
            <v-col cols="12" xs="6">
              <span class="font-weight-light" v-if="company.acquirerName">{{ company.acquirerName || "--" }}</span>
              <span class="font-weight-light" v-else>--</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Acquirer Name:</span>
                <span
                  class="font-weight-light float-right"
                  v-if="company.acquirerName"
                >{{ company.acquirerName || "--" }}</span>
              <span class="font-weight-light float-right" v-else>--</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-none d-md-block" no-gutters>
            <v-col cols="12" xs="6">
              <div class="subtitle-2 font-weight-medium">Date Founded:</div>
            </v-col>
            <v-col cols="12" xs="6">
              <span class="font-weight-light" v-if="company.dateFounded">{{ company.dateFounded | moment("from", "now") }}</span>
              <span class="font-weight-light" v-else>--</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Date Founded:</span>
                <span
                  class="font-weight-light float-right"
                  v-if="company.dateFounded"
                >{{ company.dateFounded | moment("from", "now") }}</span>
              <span class="font-weight-light float-right" v-else>--</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-none d-md-block" no-gutters>
            <v-col cols="12" xs="6">
              <div class="subtitle-2 font-weight-medium">Exit Date:</div>
            </v-col>
            <v-col cols="12" xs="6">
              <span class="font-weight-light" v-if="company.exitDate">{{ company.exitDate | moment("from", "now") }}</span>
              <span class="font-weight-light" v-else>--</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Exit Date:</span>
                <span
                  class="font-weight-light float-right"
                  v-if="company.exitDate"
                >{{ company.exitDate | moment("from", "now") }}</span>
              <span class="font-weight-light float-right" v-else>--</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-none d-md-block" no-gutters>
            <v-col cols="12" xs="6">
              <div class="subtitle-2 font-weight-medium">Exit Value:</div>
            </v-col>
            <v-col cols="12" xs="6">
              <span class="font-weight-light" v-if="company.exitValue">{{ company.exitValue || "--" }}</span>
              <span class="font-weight-light" v-else>--</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Exit Value:</span>
                <span
                  class="font-weight-light float-right"
                  v-if="company.exitValue"
                >{{ company.exitValue || "--"}}</span>
              <span class="font-weight-light float-right" v-else>--</span>
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
              <span class="font-weight-light">{{ company.status || "--" }}</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Status:</span>
                <span class="font-weight-light float-right">{{ company.status || "--" }}</span>
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
            <v-col cols="12" >
              <div class="subtitle-2 font-weight-medium">Description:</div>
            </v-col>
            <v-col cols="12" class="pr-2">
              <long-paragraph
                class="font-weight-light text-justify"
                :text="company.description"
                :maxLength="100"
              ></long-paragraph>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import LongParagraph from "../../common/LongParagraph.vue";
import gql from "graphql-tag";
export default {
  data() {
    return {
      company: null,
    };
  },
  components: {
    LongParagraph
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
            modificationTime
            scaleScore
            capitalEfficiencyScore
            dateFounded
            acquirerName
            exitDate
            exitValue
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
  computed: {
    httpCompany: function() {
      return this.company.url.startsWith("http")
        ? this.company.url
        : `http://${this.company.url}`;
    }
  }
};
</script>

<style scoped>
.v-card__text {
  padding: 0.5em;
  padding-left: 1em;
}
</style>
