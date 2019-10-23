<template>
  <v-layout>
    <v-flex class="text-center">
      <v-sheet style="width:100%; overflow: hidden;">
        <openrpc-info-bar :info="openrpc.info" :endpoint="endpoint"/>
        <openrpc-methods :data="openrpc.methods" :api="apiId"/>
      </v-sheet>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from 'axios'
import $RefParser from 'json-schema-ref-parser'
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
      errors: [],
      openrpc: {},
      jsonUrl: '',
      endpoint: '',
      statusCopySuccess: false,
      statusCopyError: false
    }
  },
  methods: {
    init () {
      // set editMode false
      this.$store.commit('setEditMode', false)
      // set jsonURL (fallback: ubiq)
      this.jsonUrl = this.$store.state.apis[this.apiId] ? this.$store.state.apis[this.apiId].json : this.$store.state.apis.ubiq.json
      this.endpoint = this.$store.state.apis[this.apiId] ? this.$store.state.apis[this.apiId].url : this.$store.state.apis.ubiq.url
      this.discover()
    },
    discover () {
      axios.get(this.jsonUrl)
        .then((r) => {
          console.log(r)
          if (r.data.openrpc) {
            $RefParser.dereference(r.data, (err, schema) => {
              if (err) {
                console.log(err)
              } else {
                this.openrpc = schema
                const schemas = schema.components.schemas
                const methods = schema.methods
                // add api endpoint to openrpc.info
                schema.info.url = this.endpoint

                let count = 0
                // add a numeric ID to each method
                for (const method of methods) {
                  method.methodId = count
                  methods[count] = method
                  count++
                }
                // update state
                this.$store.commit('setOpenRpc', schema)
                this.$store.commit('setSchemas', schemas)
                this.$store.commit('setApi', this.apiId)
                this.$store.commit('setMethods', methods)
              }
            })
          }
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>
