<template>
  <v-layout>
    <v-flex class="text-center">
      <openrpc-info-bar :info="openrpc.info" :endpoint="endpoint"/>
      <v-sheet style="width:100%; overflow: hidden;">
        <v-tabs v-model="openrpcTab" grow>
          <v-tab
            v-for="tab in tabs"
            :key="tab"
            ripple
          >
            {{ tab }}
          </v-tab>
        </v-tabs>
        <v-divider />
        <v-tabs-items v-model="openrpcTab">
          <v-tab-item key="Methods">
            <openrpc-methods :data="openrpc.methods" :api="apiId"/>
          </v-tab-item>
          <v-tab-item key="Components">
            <v-col class="d-flex" cols="12">
              <v-card  v-if="openrpc.components" outlined>
                <v-card-title class="align-end">Content Descriptors</v-card-title>
                <v-flex
                  v-for="(item, i) in openrpc.components.contentDescriptors"
                  :key="i"
                >
                  <openrpc-param :item="item" />
                </v-flex>
              </v-card>
            </v-col>
          </v-tab-item>
        </v-tabs-items>
      </v-sheet>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from 'axios'
import $RefParser from 'json-schema-ref-parser'
import OpenrpcParam from '@/components/cards/Param'
import OpenrpcInfoBar from '@/components/bars/Info'
import OpenrpcMethods from '@/components/tables/Methods'

export default {
  props: ['apiId'],
  components: {
    OpenrpcInfoBar,
    OpenrpcMethods,
    OpenrpcParam
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
      openrpcTab: null,
      tabs: ['Methods', 'Components'],
      statusCopySuccess: false,
      statusCopyError: false
    }
  },
  methods: {
    init () {
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
