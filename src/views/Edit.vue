<template>
  <v-layout>
    <left-drawer v-if="modified" :methods="injectedWithMethodId" :apiId="apiId" />
    <v-flex>
      <v-btn
        color="secondary"
        @click.stop="toggleLeftDrawer()"
        class="drawer-handle left"
      >
        <v-icon
          v-if="$store.state.showLeftDrawer"
          class="pl-0 pr-2"
        >
          mdi-chevron-left
        </v-icon>
        <v-icon
          v-else
          class="pl-0 pr-2"
        >
          mdi-chevron-right
        </v-icon>
      </v-btn>
      <v-btn
        color="secondary"
        @click.stop="toggleRightDrawer()"
        class="drawer-handle right"
      >
        <v-icon
          v-if="$store.state.showRightDrawer"
          class="pl-2 pr-0"
        >
          mdi-chevron-right
        </v-icon>
        <v-icon
          v-else
          class="pl-2 pr-0"
        >
          mdi-chevron-left
        </v-icon>
      </v-btn>
      <v-sheet style="width:100%; overflow:hidden;">
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
            <copy-to-clipboard :copy="modified"/>
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
  </v-layout>
</template>

<script>
import axios from 'axios'
import MonacoEditor from 'vue-monaco'
import $RefParser from 'json-schema-ref-parser'
import LeftDrawer from '@/components/LeftDrawer'
import CopyToClipboard from '@/components/btns/CopyToClipboard'

export default {
  props: ['apiId'],
  components: {
    MonacoEditor,
    LeftDrawer,
    CopyToClipboard
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
      // return monaco editor theme based on vuetify
      return this.$vuetify.theme.dark ? 'vs-dark' : 'vs'
    },
    injectedWithMethodId () {
      const d = JSON.parse(this.modified)
      let m = d.methods
      let count = 0
      // add a numeric ID to each method
      for (let method of m) {
        method.methodId = count
        m[count] = method
        count++
      }

      return m
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
      }
    }
  },
  methods: {
    init () {
      // set editMode true
      this.$store.commit('setEditMode', true)
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
    toggleLeftDrawer () {
      this.$store.commit('showLeftDrawer', !this.$store.state.showLeftDrawer)
    },
    toggleRightDrawer () {
      this.$store.commit('showRightDrawer', !this.$store.state.showRightDrawer)
    },
    deref (json) {
      try {
        let api = $RefParser.dereference(json)

        return api
      }
      catch (err) {
        console.log(err)
        return json // return un-dereffed json
      }
    }
  }
}

</script>
