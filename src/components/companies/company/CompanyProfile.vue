<template>
  <v-card v-if="company" style="height:100%;" class="pa-3">
    <v-row no-gutters>
      <v-col cols="12" md="6" class="pa-md-1">
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
            >{{ company.url || "--"}}</a>
          </v-col>
        </v-row>
        <v-row class="d-block d-md-none" no-gutters>
          <v-col xs="12">
            <div>
              <span class="subtitle-2 font-weight-medium">Website:</span>
              <span class="font-weight-light float-right">
                <a
                  v-if="company.url"
                  :key="`news-external-link${company.url || ''}`"
                  :href="httpCompany"
                  target="_blank"
                >{{ company.url || "--"}}</a>
              </span>
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="6" class="pa-md-1">
        <v-row class="d-none d-md-block" no-gutters>
          <v-col cols="12" xs="6">
            <div class="subtitle-2 font-weight-medium">LinkedIn</div>
          </v-col>
          <v-col cols="12" xs="6">
            <a
              v-if="company.linkedinHandle"
              :href="companyLinkedinHandleUrl"
              target="_blank"
            >{{companyLinkedinHandle}}</a>
            <span v-else>--</span>
          </v-col>
        </v-row>
        <v-row class="d-block d-md-none" no-gutters>
          <v-col xs="12">
            <div>
              <span class="subtitle-2 font-weight-medium">LinkedIn:</span>
              <span class="font-weight-light float-right">
                <a
                  v-if="company.linkedinHandle"
                  :href="companyLinkedinHandleUrl"
                  target="_blank"
                >{{companyLinkedinHandle}}</a>
                <span v-else>--</span>
              </span>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12" md="6" class="pa-md-1">
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
      </v-col>
      <v-col cols="12" md="6" class="pa-md-1">
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
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12" md="6" class="pa-md-1">
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
      </v-col>
      <v-col cols="12" md="6" class="pa-md-1">
        <v-row class="d-none d-md-block" no-gutters>
          <v-col cols="12" xs="6">
            <div class="subtitle-2 font-weight-medium">Industry</div>
          </v-col>
          <v-col cols="12" xs="6">
            <span class="font-weight-light text-capitalize">{{ company.industry || "--" }}</span>
          </v-col>
        </v-row>
        <v-row class="d-block d-md-none" no-gutters>
          <v-col xs="12">
            <div>
              <span class="subtitle-2 font-weight-medium">Industry:</span>
              <span class="font-weight-light text-capitalize float-right">{{ company.industry || "--" }}</span>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12" md="6" class="pa-md-1">
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
      </v-col>
      <v-col cols="12" md="6" class="pa-md-1">
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
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12" md="6" class="pa-md-1">
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
      </v-col>
      <v-col cols="12" md="6" class="pa-md-1">
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
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12" md="6" class="pa-md-1">
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
      </v-col>
      <v-col cols="12" md="6" class="pa-md-1">
        <v-row class="d-none d-md-block" no-gutters>
          <v-col cols="12" xs="6">
            <div class="subtitle-2 font-weight-medium">NAICS Description:</div>
          </v-col>
          <v-col cols="12" xs="6">
            <span
              class="font-weight-light"
              v-if="company.naics"
            >{{ company.naics.description || "--" }}</span>
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
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12" md="6" class="pa-md-1">
        <v-row class="d-none d-md-block" no-gutters>
          <v-col cols="12" xs="6">
            <div class="subtitle-2 font-weight-medium">Scale Score:</div>
          </v-col>
          <v-col cols="12" xs="6">
            <span
              class="font-weight-light"
              v-if="company.scaleScore"
            >{{ company.scaleScore || "--" }}</span>
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
      </v-col>
      <v-col cols="12" md="6" class="pa-md-1">
        <v-row class="d-none d-md-block" no-gutters>
          <v-col cols="12" xs="6">
            <div class="subtitle-2 font-weight-medium">Capital Efficiency Score:</div>
          </v-col>
          <v-col cols="12" xs="6">
            <span
              class="font-weight-light"
              v-if="company.capitalEfficiencyScore"
            >{{ company.capitalEfficiencyScore || "--" }}</span>
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
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12" md="6" class="pa-md-1">
        <v-row class="d-none d-md-block" no-gutters>
          <v-col cols="12" xs="6">
            <div class="subtitle-2 font-weight-medium">Acquirer Name:</div>
          </v-col>
          <v-col cols="12" xs="6">
            <span
              class="font-weight-light"
              v-if="company.acquirerName"
            >{{ company.acquirerName || "--" }}</span>
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
      </v-col>
      <v-col cols="12" md="6" class="pa-md-1">
        <v-row class="d-none d-md-block" no-gutters>
          <v-col cols="12" xs="6">
            <div class="subtitle-2 font-weight-medium">Year Founded:</div>
          </v-col>
          <v-col cols="12" xs="6">
            <span
              class="font-weight-light"
              v-if="company.dateFounded"
            >{{ company.dateFounded | moment("YYYY") }}</span>
            <span class="font-weight-light" v-else>--</span>
          </v-col>
        </v-row>
        <v-row class="d-block d-md-none" no-gutters>
          <v-col xs="12">
            <div>
              <span class="subtitle-2 font-weight-medium">Year Founded:</span>
              <span
                class="font-weight-light float-right"
                v-if="company.dateFounded"
              >{{ company.dateFounded | moment("YYYY") }}</span>
              <span class="font-weight-light float-right" v-else>--</span>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12" md="6" class="pa-md-1">
        <v-row class="d-none d-md-block" no-gutters>
          <v-col cols="12" xs="6">
            <div class="subtitle-2 font-weight-medium">Exit Date:</div>
          </v-col>
          <v-col cols="12" xs="6">
            <span
              class="font-weight-light"
              v-if="company.exitDate"
            >{{ company.exitDate | moment("from", "now") }}</span>
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
      </v-col>
      <v-col cols="12" md="6" class="pa-md-1">
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
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12" md="6" class="pa-md-1">
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
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12" class="pa-md-1">
        <v-row no-gutters>
          <v-col cols="12">
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
    LongParagraph,
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
            linkedinHandle
            status
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
          uid: this.$route.params.companiesUid,
        };
      },
      fetchPolicy: "cache-and-network",
    },
  },
  computed: {
    httpCompany: function () {
      return this.company.url.startsWith("http")
        ? this.company.url
        : `http://${this.company.url}`;
    },
    companyLinkedinHandleUrl() {
      if (this.company.linkedinHandle) {
        let linkedHandleNorm = this.company.linkedinHandle.trim().toLowerCase();
        if (linkedHandleNorm.startsWith("linkedin")) {
          return `https://${this.company.linkedinHandle}`;
        } else if (linkedHandleNorm.startsWith("company")) {
          return `https://linkedin.com/${this.company.linkedinHandle}`;
        } else {
          return `https://linkedin.com/company/${this.company.linkedinHandle}`;
        }
      }
      return undefined;
    },
    companyLinkedinHandle() {
      if (this.company.linkedinHandle) {
        return this.company.linkedinHandle.split("/").slice(-1).pop();
      }
      return undefined;
    },
  },
};
</script>

<style scoped>
</style>
