<template>
  <v-layout>
    <v-flex class="text-center">
      <v-sheet style="width:100%; overflow: hidden;">
        <openrpc-info-bar :info="deref.info" :endpoint="endpoint"/>
        <openrpc-methods :data="deref.methods" :api="apiId"/>
      </v-sheet>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from 'axios'
import OpenrpcInfoBar from '@/components/bars/Info'
import OpenrpcMethods from '@/components/tables/Methods'

export default {
  props: ['apiId'],
  components: {
    OpenrpcInfoBar,
    OpenrpcMethods
  },
  watch: {
    apiId: function () {
      this.init()
    }
  },
  created () {
    this.init()
  },
  data () {
    return {
      jsonUrl: '',
      endpoint: ''
    }
  },
  computed: {
    deref () {
      return this.$store.state.apis[this.apiId].openrpc.original.deref
    }
  },
  methods: {
    init () {
      // set editMode false
      this.$store.commit('setEditMode', false)
      this.$store.commit('setApiId', this.apiId)

      // set jsonURL (fallback: ubiq)
      this.jsonUrl = this.$store.state.apis[this.apiId] ? this.$store.state.apis[this.apiId].info.json : this.$store.state.apis.ubiq.info.json
      this.endpoint = this.$store.state.apis[this.apiId] ? this.$store.state.apis[this.apiId].info.url : this.$store.state.apis.ubiq.info.url
      this.discover()
    },
    discover () {
      if (!this.$store.state.apis[this.apiId].openrpc.original.schema.openrpc) {
        axios.get(this.jsonUrl)
          .then((r) => {
            if (r.data.openrpc) {
              // store original schema in state
              this.$store.commit('setOpenRpcOriginal', {apiId: this.apiId, json: r.data})
            }
          })
          .catch((e) => {
            console.log(e)
          })
      }
    }
  }
}
</script>
