<template>
  <div>
    <v-card-title>
      <h1 class="font-weight-regular">API v2 Introduction</h1>
    </v-card-title>
    <v-card-text>
      <p>Welcome to the DigitalOcean API documentation.</p>
      <p>The DigitalOcean API allows you to manage Droplets and resources within the DigitalOcean cloud in a simple, programmatic way using conventional HTTP requests. The endpoints are intuitive and powerful, allowing you to easily make calls to retrieve information or to execute actions.</p>
      <p>All of the functionality that you are familiar with in the DigitalOcean control panel is also available through the API, allowing you to script the complex actions that your situation requires.</p>
      <p>The API documentation will start with a general overview about the design and technology that has been implemented, followed by reference information about specific endpoints.</p>
      <v-simple-table light>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Name</th>
              <th class="text-left">Type</th>
              <th class="text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in desserts" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.type }}</td>
              <td>{{ item.description }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
  </div>
</template>
<script>
export default {
  data() {
    return {
      desserts: [
        {
          name: "id",
          type: "string",
          description:
            'A short identifier corresponding to the HTTP status code returned. For example, the ID for a response returning a 404 status code would be "not_found."'
        },
        {
          name: "message",
          type: "string",
          description:
            "A message providing additional information about the error, including details to help resolve it when possible."
        },
        {
          name: "request_id",
          type: "string",
          description:
            "Optionally, some endpoints may include a request ID that should be provided when reporting bugs or opening support tickets to help identify the issue."
        }
      ]
    };
  }
};
</script>