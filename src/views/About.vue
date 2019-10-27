<template>
  <v-layout class="text-center">

    <v-flex
      class="pa-6"
    >
      <h3>Welcome to Octano d0x</h3>
      <p>Octano d0x is an <a href="https://open-rpc.org/beginners/" target="_blank">OpenRPC</a> interface built using <a href="https://vuejs.org/" target="_blank">Vue.js</a>.</p>
      <p>Select an API in the dropdown menu above, get started on a <router-link :to="{name: 'Edit', params: {apiId: 'custom'}}">new OpenRPC document</router-link>, or get involved on <a href="https://github.com/octanolabs/vue-openrpc-d0x" target="_blank">Github</a>.</p>

      <v-carousel
        :show-arrows="false"
        :hide-delimiters="true"
        cycle
        elevation="12"
        style="max-width:800px"
        class="ml-auto mr-auto"
      >
        <v-carousel-item
          class="ma-0 pa-0"
          v-for="(item,i) in items"
          :key="i"
        >
          <img :src="require('../assets/screenshots/' + item)"
            width="100%"
          />
        </v-carousel-item>
      </v-carousel>
      <v-flex>
        <v-avatar tile class="mr-3">
          <img :src="require('../assets/apis/ubiq.svg')" height="32px"/>
        </v-avatar>
        <v-avatar tile>
          <img :src="require('../assets/openrpc.png')" width="64px"/>
        </v-avatar>
        <v-avatar tile class="ml-3">
          <img :src="require('../assets/apis/etc.svg')" height="64px"/>
        </v-avatar>
      </v-flex>
    </v-flex>
  </v-layout>
</template>

<script>

export default {
  data () {
    return {
      items: ['0.png', '1.png','2.png','3.png','4.png']
    }
  }
}

</script>
