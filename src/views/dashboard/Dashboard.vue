<template>
  <v-card class="ma-3">
    <v-card-title>
      <div class="display-1">Dashboard</div>
    </v-card-title>
    <v-row>
      <v-col cols="12" sm="4"
        ><v-card max-width="450" class="elevation-1">
          <v-list class="pa-0">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title
                  class="text-center d-flex justify-center overline"
                  ><v-icon medium class="mx-1">{{ companies.icon }}</v-icon>
                  <p class="textItem">
                    {{ (companies.subtitle).toLocaleString() }}
                  </p></v-list-item-title
                >
                <v-list-item-subtitle class="text-center overline "
                  >{{ companies.title }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4"
        ><v-card max-width="450" class="elevation-1">
          <v-list class="pa-0">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title
                  class="text-center d-flex justify-center overline"
                  ><v-icon medium class="mx-1">{{ contacts.icon }}</v-icon>
                  <p class="textItem">
                    {{ (contacts.subtitle).toLocaleString() }}
                  </p></v-list-item-title
                >
                <v-list-item-subtitle class="text-center overline "
                  >{{ contacts.title }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4"
        ><v-card max-width="450" class="elevation-1">
          <v-list class="pa-0">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title
                  class="text-center d-flex justify-center overline"
                  ><v-icon medium class="mx-1">{{ signals.icon }}</v-icon>
                  <p class="textItem">
                    {{ (signals.subtitle).toLocaleString() }}
                  </p></v-list-item-title
                >
                <v-list-item-subtitle class="text-center overline "
                  >{{ signals.title }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <v-tabs grow background-color="grey lighten-5" color="primary">
      <v-tab class="text-capitalize"> Sales Signals </v-tab>
      <v-tab-item>
        <!-- Custom Signal Groups -->
        <custom-signal-groups />
      </v-tab-item>
      <v-tab class="text-capitalize"> Custom Sales Signals </v-tab>
      <v-tab-item>
        <!-- Custom Sales Signals -->
        <custom-sales-signals />
      </v-tab-item>
    </v-tabs>
    <!-- Custom Sales Signals -->
  </v-card>
</template>

<script>
import customSalesSignals from "../../components/dashboard/CustomSalesSignals";
import customSignalGroups from "../../components/dashboard/CustomSignalGroups";
export default {
  components: {
    customSalesSignals,
    customSignalGroups,
  },
  data() {
    return {
      signals: {
        icon: "graphic_eq",
        title: "Signals",
        subtitle: 7004666,
      },
      contacts: {
        icon: "contacts",
        title: "Contacts",
        subtitle: 152350,
      },
      companies: {
        icon: "business",
        title: "Companies",
        subtitle: 6293906,
      },
    };
  },
};
</script>

<style scoped>
.textItem {
  font-size: 24px;
  margin-top: 2px;
  margin-bottom: 0;
}
</style>
