<template>
  <v-layout class="text-center">

    <v-flex
      class="pa-6"
    >
      <h3>Welcome to Octano d0x</h3>
      <p>d0x is an open-source <a href="https://open-rpc.org" target="_blank">OpenRPC</a> document viewer and editor written in <a href="https://vuejs.org/" target="_blank">Vue.js</a>.</p>
      <v-card
        elevation="12"
        class="ma-auto"
        max-width="80%"
      >
        <v-carousel
          :show-arrows="false"
          height="600px"
          cycle
        >
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
      items: ['1.png','2.png','3.png','4.png']
    }
  }
}

</script>
