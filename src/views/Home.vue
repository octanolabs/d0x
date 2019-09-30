<template>
  <v-layout>
    <v-flex class="text-center">
      <v-card style="margin-bottom:15px;">
        <open-rpc-info :info="[ openrpc.info ]" />
      </v-card>
      <open-rpc-methods :data="openrpc.methods" />
    </v-flex>
  </v-layout>
</template>

<script>
// import axios from 'axios'
import $RefParser from 'json-schema-ref-parser'
import OpenRpcInfo from '@/components/Info'
import OpenRpcMethods from '@/components/Methods'
import OpenRpc from '@/assets/gubiq-openrpc.js'

export default {
  components: {
    OpenRpcInfo,
    OpenRpcMethods
  },
  data () {
    return {
      errors: [],
      openrpc: {},
      endpoint: 'http://127.0.0.1:8588'
    }
  },
  created () {
    this.discover(this.endpoint)
  },
  methods: {
    discover (endpoint) {
      /*
      axios.post(endpoint, {
        id: 1,
        jsonrpc: '2.0',
        method: 'rpc.discover',
        params: []
      })
        .then((r) => {
          console.log(r.data.result)
          if (r.data.result.openrpc) {
            $RefParser.dereference(r.data.result, (err, schema) => {
              if (err) {
                console.log(err)
              } else {
                this.openrpc = schema
                const schemas = schema.components.schemas
                const methods = schema.methods
                this.$store.commit('apis/setOpenRpc', schema)
                this.$store.commit('apis/setSchemas', schemas)
                this.$store.commit('apis/setMethods', methods)
              }
            })
          }
        })
        .catch((e) => {
          console.log(e)
        }) */
      $RefParser.dereference(OpenRpc, (err, schema) => {
        if (err) {
          console.log(err)
        } else {
          this.openrpc = schema
          const schemas = schema.components.schemas
          const methods = schema.methods
          this.$store.commit('setOpenRpc', schema)
          this.$store.commit('setSchemas', schemas)
          console.log(endpoint)
          let count = 0
          for (const method of methods) {
            method.methodId = count
            methods[count] = method
            count++
          }
          this.$store.commit('setMethods', methods)
        }
      })
    }
  }
}
</script>
