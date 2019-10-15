<template>
  <v-layout>
    <left-drawer :methods="methods"/>
    <v-flex>
      <v-sheet style="width:100%; overflow: hidden;">
        <v-flex>
          <v-toolbar dense color="#212121" class="elevation-0">
            <v-tabs v-model="tab">
              <v-tab ripple>
                <v-icon small class="mr-1">mdi-json</v-icon>
                Editor
              </v-tab>
              <v-tab ripple>
                <v-icon small class="mr-1">mdi-compare</v-icon>
                Diff
              </v-tab>
            </v-tabs>
            <v-spacer />
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  small
                  v-on="on"
                  v-clipboard:copy="modified"
                  v-clipboard:success="copySuccess"
                  v-clipboard:error="copyError"
                >
                  <v-icon small>mdi-content-copy</v-icon>
                </v-btn>
              </template>
              <span>Copy to clipboard.</span>
            </v-tooltip>

          </v-toolbar>
          <v-tabs-items v-model="tab">
            <v-tab-item key="Editor">
              <MonacoEditor
                :options="editorOptions"
                class="editor"
                v-model="modified"
                :theme="theme"
                language="json"
              />
            </v-tab-item>
            <v-tab-item key="Diff">
              <MonacoEditor
                :options="diffEditorOptions"
                :diffEditor="true"
                class="editor"
                v-model="modified"
                :original="original"
                :theme="theme"
                language="json"/>
            </v-tab-item>
          </v-tabs-items>
        </v-flex>
      </v-sheet>
    </v-flex>
    <v-snackbar
      v-model="copy.success"
      color="primary"
    >
      Copied to your clipboard.
      <v-btn
        text
        @click="copy.success = false"
      >
        Close
      </v-btn>
    </v-snackbar>
    <v-snackbar
      v-model="copy.error"
      color="error"
    >
      Unable to copy to clipboard. Copy manually or change browser.
      <v-btn
        text
        @click="copy.error = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </v-layout>
</template>

<script>
import axios from 'axios'
import MonacoEditor from 'vue-monaco'
import $RefParser from 'json-schema-ref-parser'
import LeftDrawer from '@/components/LeftDrawer';

export default {
  props: ['apiId'],
  components: {
    MonacoEditor,
    LeftDrawer
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
    theme () {
      return this.$vuetify.theme.dark ? 'vs-dark' : 'vs'
    },
    methods () {
      return this.$store.state.methods
    }
  },
  data () {
    return {
      jsonUrl: '',
      endpoint: '',
      original: '',
      modified: '',
      tab: 0,
      editorOptions: {
        automaticLayout: true, // polls parent container size every 100ms and resizes if changed.
        scrollBeyondLastLine: false,
      },
      diffEditorOptions: {
        followsCaret: true, // resets the navigator state when the user selects something in the editor
        ignoreCharChanges: true,
        scrollBeyondLastLine: false,
        automaticLayout: true
      },
      copy: {
        success: false,
        error: false
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
            // orginal (unmodified) source openrpc.json
            this.original = JSON.stringify(r.data, null, 2)
            // v-model used by editor (separate so we can use diff editor)
            this.modified  = this.original

            // de-ref openrpc document
            $RefParser.dereference(r.data, (err, schema) => {
              if (err) {
                console.log(err)
              } else {
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
    },
    copySuccess () {
      this.copy.success = true
    },
    copyError () {
      this.copy.error = true
    }
  }
}
</script>
