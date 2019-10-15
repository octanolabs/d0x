<template>
  <v-layout>
    <v-flex>
      <v-sheet style="width:100%; overflow: hidden;">
        <v-flex>
          <v-toolbar class="elevation-0">
            <v-btn
              icon
              text
              @click.stop="tab = 0"
            >
              <v-icon>mdi-json</v-icon>
            </v-btn>
            <v-btn
              icon
              text
              @click.stop="tab = 1"
            >
              <v-icon>mdi-compare</v-icon>
            </v-btn>
            <v-spacer />
            <v-btn
              icon
              text
              @click.stop="tab = 1"
            >
              <v-icon>mdi-content-copy</v-icon>
            </v-btn>
          </v-toolbar>
          <v-tabs-items v-model="tab">
            <v-tab-item key="Editor">
              <MonacoEditor
                :options="editorOptions"
                class="editor"
                v-model="modified"
                :theme="darkMode ? 'vs-dark' : 'vs'" language="json"
              />
            </v-tab-item>
            <v-tab-item key="Diff">
              <MonacoEditor :options="diffEditorOptions" :diffEditor="true" class="editor" v-model="modified" :original="original" :theme="darkMode ? 'vs-dark' : 'vs'" language="json"/>
            </v-tab-item>
          </v-tabs-items>
        </v-flex>
      </v-sheet>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from 'axios'
import MonacoEditor from 'vue-monaco'
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
      return JSON.stringify(this.openrpc, null, 2)
    },
    darkMode () {
      return this.$vuetify.theme.dark
    }
  },
  data () {
    return {
      errors: [],
      openrpc: {},
      jsonUrl: '',
      endpoint: '',
      original: '',
      modified: '',
      tab: 0,
      editorOptions: {
        automaticLayout: true,
        scrollBeyondLastLine: false,
      },
      diffEditorOptions: {
        followsCaret: true, // resets the navigator state when the user selects something in the editor
        ignoreCharChanges: true,
        scrollBeyondLastLine: false,
        automaticLayout: true
      }
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
            this.original = JSON.stringify(r.data, null, 2)
            this.modified  = this.original

            // TODO
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
