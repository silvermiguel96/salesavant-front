<template>
  <div>
    <v-menu open-on-hover offset-y>
      <template v-slot:activator="{ on }">
        <v-btn class="text-capitalize" color="light-blue darken-1" v-on="on"  dark block>
          <v-icon size="18" class="mr-2">settings</v-icon>  
          <slot name="label"></slot>
        </v-btn>
      </template>
      <v-list>
        <v-list-item v-for="(item, index) in items" :key="index"  @click="item.callback">
          <v-icon size="18" class="mr-2">{{ item.icon }}</v-icon>
          <v-list-item-title class="text-left">{{ item.title }}</v-list-item-title>
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
