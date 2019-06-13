<template>
  <v-card>
    <v-card-title>
      <v-layout row wrap>
        <v-flex md6>
          <form >
            <v-textarea
              v-model="companies"
              placeholder="copy and paste, as many companies as you want, but each company needs to be in one line"
            ></v-textarea>
          </form>
        </v-flex>
        <v-flex md1 class="ma-3">
          <v-btn @click="onSubmit">send</v-btn>
          <p class="title">{{error}}</p>
        </v-flex>
      </v-layout>
    </v-card-title>
    <v-card-text>
      <p v-show="loading" class="title">LOADING RESULTS {{ loadingResults }}</p>
      <v-data-table :headers="headers" :items="results" class="elevation-1"  width: string>
        <template slot="items" scope="props">
          <tr>
            <td>{{props.index + 1}}</td>
            <td>{{props.item.company.domain || ''}}</td>
            <td>{{props.item.response.name || ''}}</td>  
            <td v-if="!props.item.response.description">
              {{ '' }}
            </td>
            <td v-else>
              <ButtonModalDescription :items="props.item.response.description" :header="`description`"></ButtonModalDescription>
            </td>           
            <td>{{props.item.response.phone || '' }}</td>
            <td>{{props.item.response.address.address1 || '' }}</td>
            <td>{{props.item.response.address.address2 || '' }}</td>
            <td>{{props.item.response.address.city || '' }}</td>
            <td>{{props.item.response.address.state || '' }}</td>
            <td>{{props.item.response.address.zip || '' }}</td>
            <td>{{props.item.response.address.country || '' }}</td>
            <td>{{props.item.response.address.iso_country_code || '' }}</td>
            <td>{{props.item.response.company_status || ''}}</td>
            <td>{{props.item.response.orb_num || ''}}</td>
            <td v-if="props.item.response.orb_nums.length === 0">
              {{ '' }}
            </td>
            <td v-else>
              <ButtonModal :items="props.item.response.orb_nums" :header="`orb nums`"></ButtonModal>
            </td>
            <td>{{props.item.response.parent_orb_num || ''}}</td>
            <td>{{props.item.response.parent_name || ''}}</td>
            <td>{{props.item.response.branches_count || ''}}</td>
            <td>{{props.item.response.subsidiaries_count || ''}}</td>
            <td>{{props.item.response.ultimate_parent_orb_num || ''}}</td>
            <td>{{props.item.response.ultimate_parent_name || ''}}</td>
            <td>
              <p v-for="name in props.item.response.names" :key="name">
                {{ name }}
              </p>
            </td>
            <td>{{props.item.response.website || ''}}</td> 
            <td>{{props.item.response.webdomain || ''}}</td>
            <td v-if="props.item.response.webdomains.length === 0">
              {{ '' }}
            </td>
            <td v-else>
              <ButtonModal :items="props.item.response.webdomains" :header="`web domains`"></ButtonModal>
            </td>
            <td v-if="props.item.response.webdomains_info.length === 0">
              {{ '' }}
            </td>
            <td v-else>
              <ButtonModalWebDomainsInfo :items="props.item.response.webdomains_info" 
              :header="`web domains info`"></ButtonModalWebDomainsInfo>
            </td> 
            <td>{{props.item.response.industry || ''}}</td>
            <td>{{props.item.response.naics_code || ''}}</td> 
            <td v-if="!props.item.response.naics_description">
              {{ '' }}
            </td>
            <td v-else>
              <ButtonModalDescription :items="props.item.response.naics_description"
              :header="`naics description`"></ButtonModalDescription>
            </td>
            <td v-if="props.item.response.naics_codes.length === 0">
              {{ '' }}
            </td>
            <td v-else>
              <ButtonModalCode :items="props.item.response.naics_codes"
               :header="`naics codes`"></ButtonModalCode>
            </td>
            <td>{{props.item.response.sic_code || ''}}</td>
            <td>{{props.item.response.sic_description || ''}}</td>
            <td v-if="props.item.response.sic_codes.length === 0">
              {{ '' }}
            </td>
            <td v-else>
              <ButtonModalCode :items="props.item.response.sic_codes" :header="`sic codes`"></ButtonModalCode>
            </td>
            <td v-if="props.item.response.categories.length === 0">
              {{ '' }}
            </td>
            <td v-else>
              <ButtonModalCategories :items="props.item.response.categories" :header="`categories`"></ButtonModalCategories>
            </td>
            <td>{{props.item.response.employees_range || '' }}</td>
            <td>{{props.item.response.employees || ''}}</td>
            <td>{{props.item.response.revenue_range || ''}}</td>
            <td>{{props.item.response.revenue || ''}}</td>
            <td>{{props.item.response.year_founded || ''}}</td>
            <td>{{props.item.response.linkedin_account.url || ''}}</td>
            <td>{{props.item.response.facebook_account.url || ''}}</td>
            <td v-if="props.item.response.facebook_account.likes === null">
              {{ '' }}
            </td>
            <td v-else>
               <span class="body-2">Likes: </span>{{props.item.response.facebook_account.likes || ''}}
            </td>

            <td>{{props.item.response.twitter_account.url || ''}}</td>
            <td v-if="props.item.response.twitter_account.followers === null">
              {{ '' }}
            </td>
            <td v-else>
              <span class="body-2">Followers: </span>{{props.item.response.twitter_account.followers || ''}}
            </td>
            <td>{{props.item.response.googleplus_account.url || ''}}</td>
            <td>{{props.item.response.youtube_account.url || ''}}</td>
            <td v-if="props.item.response.technologies.length === 0">
              {{ '' }}
            </td>
            <td v-else>
              <ButtonModalTechnologies :items="props.item.response.technologies" :header="`technologies`"></ButtonModalTechnologies>
            </td>
            <td v-if="props.item.response.rankings.length === 0">
              {{ '' }}
            </td>
            <td v-else v-for="(ranking) in props.item.response.rankings" :key="ranking">
              {{ranking || ''}}
            </td>
            <td v-if="props.item.response.eins.length === 0">
              {{ '' }}
            </td>
            <td v-else v-for="(ein) in props.item.response.eins" :key="ein">
              {{ein || ''}}
            </td>
            <td>{{props.item.response.favicon || ''}}</td>
            <td>{{props.item.response.total_funding || ''}}</td>
            <td>{{props.item.response.last_funding_round_amount || ''}}</td>
            <td>{{props.item.response.last_funding_round_year || ''}}</td>
            <td>{{props.item.response.fax || ''}}</td>
            <td>{{props.item.response.email || ''}}</td>
            <td>{{props.item.response.importance_score || ''}}</td>
            <td v-if="props.item.response.tickers.length === 0">
              {{ '' }}
            </td>
            <td v-else>
              <ButtonModalTicker :items="props.item.response.tickers" :header="`tickers `"></ButtonModalTicker>
            </td>
            <td>{{props.item.response.cik || ''}}</td>
            <td>{{props.item.response.cusip || ''}}</td>
            <td>{{props.item.response.market_cap || ''}}</td>
            <td>{{props.item.response.fiscal_year_end || ''}}</td>
            <td>{{props.item.response.cidrs_count || ''}}</td>
            <td>{{props.item.response.liveramp_idl_count || ''}}</td>
            <td>{{props.item.response.liveramp_device_count || ''}}</td> 
            <td>{{props.item.response.entity_type || ''}}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
<script>
import ButtonModal from "../../components/newcompanies/ButtonModal.vue";
import ButtonModalWebDomainsInfo from "../../components/newcompanies/ButtonModalWebDomainsInfo.vue";
import ButtonModalDescription from "../../components/newcompanies/ButtonModalDescription.vue";
import ButtonModalCode from "../../components/newcompanies/ButtonModalCode.vue";
import ButtonModalTicker from "../../components/newcompanies/ButtonModalTicker.vue";
import ButtonModalTechnologies from "../../components/newcompanies/ButtonModalTechnologies.vue";
import ButtonModalCategories from "../../components/newcompanies/ButtonModalCategories.vue";

export default {
  components: {
    ButtonModal,
    ButtonModalWebDomainsInfo,
    ButtonModalDescription,
    ButtonModalCode,
    ButtonModalTicker,
    ButtonModalTechnologies,
    ButtonModalCategories
  },
  data() {
    return {
      companies: "",
      error: "",
      results: [],
      resultsResponse: [],
      loading: false,
      loadingResults: "",
      headers: [
        { text: "#" , value: 'props.index', sortable: false },
        { text: "Domain", value: "company.domain" },
        { text: "Name", value: "response.name" },
        { text: "Description", value: "response.description" },        
        { text: "Phone", value: "response.phone", width: '100%'},
        { text: "Address 1", value: "response.address.address1" },
        { text: "Address 2", value: "response.address.address2" },
        { text: "City", value: "response.address.city" },
        { text: "State", value: "response.address.state" },
        { text: "Zip", value: "response.address.zip" },
        { text: "Country", value: "response.address.country" },
        { text: "Country Code", value: "response.address.iso_country_code" },
        { text: "Company Status", value: "response.company_status" },
        { text: "Orb Num", value: "response.orb_num" },
        { text: "Orb Nums", value: "response.orb_nums" },
        { text: "Parent Orb Num", value: "response.parent_orb_num" },
        { text: "Parent Name", value: "response.parent_name" },
        { text: "Branches Count", value: "response.branches_count" },
        { text: "Subsidiaries Count", value: "response.subsidiaries_count" },
        {
          text: "Ultimate Parent Orb Num",
          value: "response.ultimate_parent_orb_num"
        },
        {
          text: "Ultimate Parent Name",
          value: "response.ultimate_parent_name"
        },
        { text: "Names", value: "response.names" },
        { text: "Website", value: "response.website" },
        { text: "Web Domain", value: "response.webdomain" },
        { text: "Web Domains", value: "response.webdomains" },
        { text: "Web Domains Info", value: "response.webdomains_info" },
        { text: "Industry", value: "response.industry" },
        { text: "Naics Code", value: "response.naics_code" },
        { text: "Naics Description", value: "response.naics_description" },
        { text: "Naics Codes", value: "response.naics_codes" },
        { text: "Sic Code", value: "response.sic_code" },
        { text: "Sic Description", value: "response.sic_description" },
        { text: "Sic Codes", value: "response.sic_codes" },
        { text: "Categories", value: "response.categories" },
        { text: "Employees Range", value: "response.employees_range" },
        { text: "Employees", value: "response.employees" },
        { text: "Revenue Range", value: "response.revenue_range" },
        { text: "Revenue", value: "response.revenue" },
        { text: "Year Founded", value: "response.year_founded" },
        { text: "Linkedin Account", value: "response.linkedin_account" },
        { text: "Facebook Account", value: "response.facebook_account" },
        { text: "Facebook Likes", value: "response.facebook_account.likes" },
        { text: "Twitter Account", value: "response.twitter_account" },
        { text: "Twitter Followers", value: "response.twitter_account.followers" },
        { text: "Googleplus Account", value: "response.googleplus_account" },
        { text: "Youtube Account", value: "response.youtube_account" },
        { text: "Technologies", value: "response.technologies" },
        { text: "Rankings", value: "response.rankings" },
        { text: "Eins", value: "response.eins" },
        { text: "Favicon", value: "response.favicon" },
        { text: "Total Funding", value: "response.total_funding" },
        {
          text: "Last Funding Round Amount",
          value: "response.last_funding_round_amount"
        },
        {
          text: "Last Funding Round Year",
          value: "response.last_funding_round_year"
        },
        { text: "Fax", value: "response.fax" },
        { text: "Email", value: "response.email" },
        { text: "Importance Score", value: "response.importance_score" },
        { text: "Tickers", value: "response.tickers" },
        { text: "Cik", value: "response.cik" },
        { text: "Cusip", value: "response.cusip" },
        { text: "Market Cap", value: "response.market_cap" },
        { text: "Fiscal Year End", value: "response.fiscal_year_end" },
        { text: "Cidrs Count", value: "response.cidrs_count" },
        { text: "Liveramp Idl Count", value: "response.liveramp_idl_count" },
        {
          text: "Liveramp Device Count",
          value: "response.liveramp_device_count"
        },
        { text: "Entity Type", value: "response.entity_type" }
      ]
    };
  },
  methods: {
    async onSubmit() {
      try {
        this.loading = true;
        if (!!this.companies && !!this.companies.length) {
          this.loadingResults += ".";
          const companiesArray = this.companies.split("\\n");
          const companiesNames = companiesArray.map(c => ({
            name: c.split(".")[0],
            domain: c
          }));
          // console.log({ companiesNames });
          let results = [];
          for (let company of companiesNames) {
            this.loadingResults += ".";
            let response = await fetch(
              "https://rvvy3zewdd.execute-api.us-east-1.amazonaws.com/production/orb/match?name=" +
                company.name +
                "&domain=" +
                company.domain
            );

            console.log("response1", response);
            response = await response.json();
            console.log("response2", response);
            if (response.companies && !!response.companies.length) {
              response.companies.forEach(singleCompany => {
                results.push({ company, response: singleCompany });
              });
            }

            // this.headers = Object.keys(response);
            await this.timeout(10);
            this.results = results; //Esta es al respuesta
            this.resultsResponse = JSON.stringify(this.results);

            // console.log(` Este es Result ${JSON.stringify(this.results)}`);
          }
          await this.timeout(10);
          // console.log({ results });
        } else {
          this.error = "no companies to query";
          await this.timeout(3000);
          this.error = "";
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
        this.loadingResults = "";
      }
    },
    timeout(ms) {
      return new Promise(res => setTimeout(res, ms));
    }
  }
};
</script>    
<style>
table.v-table tbody td:first-child, table.v-table tbody td:not(:first-child), table.v-table tbody th:first-child, table.v-table tbody th:not(:first-child), table.v-table thead td:first-child, table.v-table thead td:not(:first-child), table.v-table thead th:first-child, table.v-table thead th:not(:first-child) {
  padding: 0 10px;
}
td {
  white-space:nowrap; 
}
</style>
