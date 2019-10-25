<template>
  <v-layout class="text-center">

    <v-flex
      class="pa-6"
    >
      <h3>Welcome to Octano d0x</h3>
      <p>d0x is an open-source <a href="https://open-rpc.org/beginners/" target="_blank">OpenRPC</a> document viewer and editor written in <a href="https://vuejs.org/" target="_blank">Vue.js</a>.</p>
      <p>Select an API in the dropdown menu above or start on a <router-link :to="{name: 'Edit', params: {apiId: 'new'}}">new OpenRPC document</router-link>.</p>
      <v-card
        elevation="12"
        class="ma-auto"
        max-width="80%"
      >
        <v-carousel>
          <v-carousel-item
            v-for="(item,i) in items"
            :key="i"
            :src="require('../assets/screenshots/' + item)"
          ></v-carousel-item>
        </v-carousel>
      </v-card>
      <v-flex class="mt-6">
        <v-avatar tile>
          <img :src="require('../assets/apis/ubiq.svg')" height="64px"/>
        </v-avatar>
        <v-avatar tile>
          <img :src="require('../assets/octano.svg')" height="64px"/>
        </v-avatar>
        <v-avatar tile>
          <img :src="require('../assets/openrpc.png')" width="64px"/>
        </v-avatar>
        <v-avatar tile>
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
