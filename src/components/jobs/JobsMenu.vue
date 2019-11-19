<template>
  <div class="text-center">
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on" min-width="150">
          <v-icon size="18" class="mr-2">update</v-icon>  
          <slot name="label"></slot>
        </v-btn>
      </template>
      <v-list>
        <v-list-item v-for="(item, index) in items" :key="index"  @click="item.callback">
          <v-icon size="18" class="mr-2">{{ item.icon }}</v-icon>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  data: () => ({}),
  props: {
    items: Array
  }
};
</script>
