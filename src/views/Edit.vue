<template>
  <v-layout>
    <left-drawer v-if="dereffed" :methods="dereffed.methods" :apiId="apiId" />
    <v-flex>
      <drawer-handle side="left" />
      <drawer-handle side="right" />
      <v-sheet style="width:100%; overflow:hidden;">
        <v-flex>
          <v-toolbar dense color="#212121" class="elevation-0">
            <v-tabs v-model="tab">
              <v-tab ripple>
                <v-icon small class="mr-1">mdi-json</v-icon>
                Editor
              </v-tab>
              <v-tab ripple>
                <v-icon small class="mr-1">mdi-file-compare</v-icon>
                Diff
              </v-tab>
            </v-tabs>
            <v-spacer />
            <copy-to-clipboard
              v-if="tab === 0"
              :copy="modified"
            />
            <span v-if="tab === 1 && diffNavi" style="height:48px;display:flex;">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon @click.stop="diffNavi.previous()" v-on="on" :disabled="!diffNavi.canNavigate()">
                    <v-icon>mdi-skip-previous</v-icon>
                  </v-btn>
                </template>
                <span>Previous.</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon @click.stop="diffNavi.next()" v-on="on" :disabled="!diffNavi.canNavigate()">
                    <v-icon>mdi-skip-next</v-icon>
                  </v-btn>
                </template>
                <span>Next.</span>
              </v-tooltip>
            </span>
          </v-toolbar>
          <v-tabs-items v-model="tab">
            <v-tab-item key="Editor">
              <MonacoEditor
                ref="editor"
                :options="editorOptions"
                class="editor"
                v-model="modified"
                :theme="theme"
                language="json"
              />
            </v-tab-item>
            <v-tab-item key="Diff">
              <MonacoEditor
                ref="diffEditor"
                :options="diffEditorOptions"
                :diffEditor="true"
                class="editor"
                v-model="modified"
                :original="original"
                :theme="theme"
                language="json"
                @editorWillMount="diffEditorWillMount"
                @editorDidMount="diffEditorDidMount"
              />
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
import LeftDrawer from '@/components/LeftDrawer'
import CopyToClipboard from '@/components/btns/CopyToClipboard'
import DrawerHandle from '@/components/btns/DrawerHandle'

export default {
  props: ['apiId'],
  components: {
    MonacoEditor,
    LeftDrawer,
    CopyToClipboard,
    DrawerHandle
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
    original () {
      return JSON.stringify(this.$store.state.apis[this.$store.state.apiId].openrpc.original.schema, null, 2)
    },
    modified: {
      get: function () {
        this.dereffed = this.$store.state.apis[this.apiId].openrpc.modified.deref
        return JSON.stringify(this.$store.state.apis[this.$store.state.apiId].openrpc.modified.schema, null, 2)
      },
      set: function (updated) {
        this.$store.commit('setOpenRpcModified', {
          apiId: this.apiId,
          json: JSON.parse(updated)
        })
      }
    },
  },
  data () {
    return {
      jsonUrl: '',
      endpoint: '',
      tab: 0,
      dereffed: {},
      monaco: null,
      diffNavi: null,
      editorOptions: {
        automaticLayout: true, // polls parent container size every 100ms and resizes if changed.
        scrollBeyondLastLine: false,
        folding: true,
        showFoldingControls: 'mouseover',
        foldingStrategy: 'indentation'
      },
      diffEditorOptions: {
        followsCaret: true, // resets the navigator state when the user selects something in the editor
        ignoreCharChanges: true,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        readOnly: true
      }
    }
  },
  methods: {
    init () {
      // set editMode true
      this.$store.commit('setEditMode', true)
      this.$store.commit('setApiId', this.apiId)
      // set jsonURL (fallback: ubiq)
      this.jsonUrl = this.$store.state.apis[this.apiId] ? this.$store.state.apis[this.apiId].info.json : this.$store.state.apis.ubiq.info.json
      this.endpoint = this.$store.state.apis[this.apiId] ? this.$store.state.apis[this.apiId].info.url : this.$store.state.apis.ubiq.info.url
      this.discover()
    },
    discover () {
      if (!this.$store.state.apis[this.apiId].openrpc.original.schema.info) {
        axios.get(this.jsonUrl)
          .then((r) => {
            if (r.data.openrpc) {
              // store original schema in state
              this.$store.commit('setOpenRpcOriginal', {apiId: this.apiId, json: r.data, modified: true})
            }
          })
          .catch((e) => {
            console.log(e)
          })
      } else {
        // original already exists, check modified
        if (!this.$store.state.apis[this.apiId].openrpc.modified.schema.info) {
          // re init with modified: true
          this.$store.commit('setOpenRpcOriginal', {
            apiId: this.apiId,
            json: this.$store.state.apis[this.apiId].openrpc.original.schema,
            modified: true
          })
        }
      }
    },
    diffEditorWillMount (monaco) {
      this.monaco = monaco
    },
    diffEditorDidMount (editor) {
      this.diffNavi = this.monaco.editor.createDiffNavigator(editor)
    }
  }
}

</script>
