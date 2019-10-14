<template>
  <v-layout>
    <v-flex>
      <v-sheet style="width:100%; overflow: hidden;">
        <v-flex>
          <v-toolbar class="elevation-0 drawer-toolbar">
            <v-toolbar-title>Editor</v-toolbar-title>
            <v-spacer />
            <v-btn
              icon
              @click.stop="closeDrawer"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
        </v-flex>
        <MonacoEditor class="editor" v-model="code" language="javascript"/>
      </v-sheet>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from 'axios'
import MonacoEditor from 'vue-monaco'
import stringifyObject from 'stringify-object'
import $RefParser from 'json-schema-ref-parser'

export default {
  props: ['apiId'],
  components: {
    MonacoEditor
  },
  watch: {
    apiId: function () {
      this.init()
    }
  },
  created () {
    this.init()
  },
  computed: {
    code () {
      return stringifyObject(this.openrpc, {
        indent: '  ',
        singleQuotes: false,
        inlineCharacterLimit: 12
      })
    }
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
