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
import axios from 'axios'
import $RefParser from 'json-schema-ref-parser'
import OpenRpcInfo from '@/components/Info'
import OpenRpcMethods from '@/components/Methods'

export default {
  props: ['apiId'],
  components: {
    OpenRpcInfo,
    OpenRpcMethods
  },
  watch: {
    apiId: function () {
      if (this.$store.state.apis[this.apiId]) {
        this.jsonUrl = this.$store.state.apis[this.apiId].json
        this.discover()
      } else {
        this.jsonUrl = this.$store.state.apis.ubiq.json
        this.discover()
      }
    }
  },
  data () {
    return {
      errors: [],
      openrpc: {},
      jsonUrl: ''
    }
  },
  methods: {
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
                this.$store.commit('setOpenRpc', schema)
                this.$store.commit('setSchemas', schemas)
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
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>
