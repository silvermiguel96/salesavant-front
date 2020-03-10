<template>
  <v-card  style="height:100%;">
    <v-card-subtitle>
      <div class="headline">{{ contacts[0].fistname}} {{ contacts[0].lastname}}</div>
      <div class="caption">Last update : {{ contacts[0].modificationTime}}</div>
    </v-card-subtitle>
    <v-divider></v-divider>
    <v-row no-gutters>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-none d-md-block" no-gutters>
            <v-col cols="12" xs="6">
              <div class="subtitle-2 font-weight-medium">contacts</div>
            </v-col>
            <v-col cols="12" xs="6">
              <span class="font-weight-light">{{ contacts.name || "[empty name]" }}</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">contacts:</span>
                <span class="font-weight-light float-right">{{ contacts.name || "[empty name]" }}</span>
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
                v-if="contacts.url"
                :key="`news-external-link${contacts.url || ''}`"
                :href="httpcontacts"
                target="_blank"
              >{{ contacts.url }}</a>
              <span v-else>--</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Website:</span>
                <span class="font-weight-light float-right">
                  <a
                    v-if="contacts.url"
                    :key="`news-external-link${contacts.url || ''}`"
                    :href="httpcontacts"
                    target="_blank"
                  >{{ contacts.url }}</a>
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
              <span class="font-weight-light">{{ contacts.vertical || "--" }}</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Vertical Groups:</span>
                <span class="font-weight-light float-right">{{ contacts.vertical || "--" }}</span>
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
              <span class="font-weight-light">{{ contacts.industry || "--" }}</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Industry:</span>
                <span class="font-weight-light float-right">{{ contacts.industry || "--" }}</span>
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
              <span class="font-weight-light">{{ contacts.status || "--" }}</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Status:</span>
                <span class="font-weight-light float-right">{{ contacts.status || "--" }}</span>
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
              <span class="font-weight-light">{{ contacts.momentum || "--" }}</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Momentum:</span>
                <span class="font-weight-light float-right">{{ contacts.momentum || "--" }}</span>
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
              <span class="font-weight-light">{{ contacts.country || "--" }}</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Country:</span>
                <span class="font-weight-light float-right">{{ contacts.country || "--" }}</span>
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
              <span class="font-weight-light">{{ contacts.state || "--" }}</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">State:</span>
                <span class="font-weight-light float-right">{{ contacts.state || "--" }}</span>
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
              <span class="font-weight-light">{{ contacts.city || "--" }}</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">City:</span>
                <span class="font-weight-light float-right">{{ contacts.city || "--" }}</span>
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
              <span class="font-weight-light">{{ contacts.numEmployees || "--" }}</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Employees:</span>
                <span class="font-weight-light float-right">{{ contacts.numEmployees || "--" }}</span>
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
              <span class="font-weight-light" v-if="contacts.naics">{{ contacts.naics.code || "--" }}</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">NAICS Code:</span>
                <span
                  class="font-weight-light float-right"
                  v-if="contacts.naics"
                >{{ contacts.naics.code || "--" }}</span>
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
              <span
                class="font-weight-light"
                v-if="contacts.naics"
              >{{ contacts.naics.description || "--" }}</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Employees:</span>
                <span
                  class="font-weight-light float-right"
                  v-if="contacts.naics"
                >{{ contacts.naics.description || "--" }}</span>
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
            <v-col cols="12" class="pr-2">
              <long-paragraph
                class="font-weight-light text-justify"
                :text="contacts.description"
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
export default {
  data() {
    return {
      contacts: [
        {
          uid: 1,
          fistname: "Miguelangel",
          lastname: "Rendon Cuartas",
          title: "developer",
          email: "silvermiguel96@gmail.com",
          find: "busqueda",
          deparment: "contacts",
          linkedin:
            "https://www.linkedin.com/in/miguelangel-rendon-cuartas-73850416b/",
          modificationTime: "2020-01-22 00:58:05"
        }
      ]
    };
  }
};
</script>

<style scoped>
.v-card__text {
  padding: 0.5em;
  padding-left: 1em;
}
</style>
