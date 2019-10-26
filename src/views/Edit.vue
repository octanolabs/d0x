<template>
  <v-layout>
    <left-drawer
      v-if="dereffed.components"
      :methods="dereffed.methods"
      :schemas="dereffed.components.schemas"
      :descriptors="dereffed.components.contentDescriptors"
      :apiId="apiId" />
    <v-flex>
      <drawer-handle side="left" />
      <drawer-handle side="right" />
      <v-sheet style="width:100%; overflow:hidden;">
        <v-flex>
          <v-toolbar dense class="elevation-0">
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
            <span v-if="tab === 1 && editors.diff.nav.instance" style="height:48px;display:flex;">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon @click.stop="toggleDiffEditorSplitView()" v-on="on">
                    <v-icon>mdi-file-compare</v-icon>
                  </v-btn>
                </template>
                <span>Toggle split view.</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon @click.stop="editors.diff.nav.instance.previous()" v-on="on" :disabled="!editors.diff.nav.instance.canNavigate()">
                    <v-icon>mdi-skip-previous</v-icon>
                  </v-btn>
                </template>
                <span>Previous.</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon @click.stop="editors.diff.nav.instance.next()" v-on="on" :disabled="!editors.diff.nav.instance.canNavigate()">
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
                :options="editors.default.options"
                class="editor"
                :value="modified"
                :theme="theme"
                language="json"
                @change="editorContentDidChange"
              />
            </v-tab-item>
            <v-tab-item key="Diff">
              <MonacoEditor
                ref="diffEditor"
                :options="editors.diff.options"
                :diffEditor="true"
                class="editor"
                :value="modified"
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
    openrpc () {
      return this.$store.state.apis[this.$store.state.apiId] ? this.$store.state.apis[this.$store.state.apiId].openrpc : false
    },
    original () {
      return JSON.stringify(this.openrpc ? this.openrpc.document.original.schema : {}, null, 2)
    },
    modified () {
      return JSON.stringify(this.openrpc ? this.openrpc.document.modified.schema : {}, null, 2)
    },
    dereffed () {
      return this.openrpc ? this.openrpc.document.modified.deref : {}
    },
  },
  data () {
    return {
      tab: 0,
      // https://microsoft.github.io/monaco-editor/api/index.html
      monaco: null,
      editors: {
        default: {
          // IStandaloneEditor
          //
          instance: null,

          options: {
            automaticLayout: true,
            scrollBeyondLastLine: false,
            folding: true,
            showFoldingControls: 'mouseover',
            foldingStrategy: 'indentation'
          }
        },
        diff: {
          // IStandaloneDiffEditor
          // https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.istandalonediffeditor.html
          instance: null,
          // IDiffEditorOptions
          // https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.idiffeditoroptions.html#rendersidebyside
          options: {
            scrollBeyondLastLine: false,
            automaticLayout: true,
            readOnly: true,
            renderSideBySide: false
          },
          nav: {
            // IDiffNavigator
            // https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.idiffnavigator.html
            instance: null,
            // IDiffNavigatorOptions
            // https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.idiffnavigatoroptions.html
            options: {
              followsCaret: true,
              ignoreCharChanges: true,
              alwaysRevealFirst: true
            }
          }
        }
      }
    }
  },
  methods: {
    init () {
      this.$store.commit('setEditMode', true)
      this.$store.commit('setApiId', this.apiId)
      if (!this.$store.state.apis[this.apiId].openrpc.document.original.schema.info) {
        // fallback to custom openrpc.json if unknown apiId
        let jsonUrl = this.$store.state.apis[this.apiId] ? this.$store.state.apis[this.apiId].info.json : this.$store.state.apis.custom.info.json
        axios.get(jsonUrl)
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
        if (!this.$store.state.apis[this.apiId].openrpc.document.modified.schema.info) {
          // re init with modified: true
          this.$store.commit('setOpenRpcOriginal', {
            apiId: this.apiId,
            json: this.$store.state.apis[this.apiId].openrpc.document.original.schema,
            modified: true
          })
        }
      }

    },
    // grab monaco on editorWillMount event (only chance we have)
    // we need for creating editors.diff.navi.instance once we have editors.diff.instance later.
    diffEditorWillMount (monaco) {
      this.monaco = monaco
    },
    // create editors.diff.navi.instance
    diffEditorDidMount (editor) {
      this.editors.diff.nav.instance = this.monaco.editor.createDiffNavigator(editor, this.editors.diff.nav.options)
      this.editors.diff.instance = editor // we need this to change diffEditor options later
      this.monaco = null // we no longer need this
    },
    // write to state using change event, it's much smoother than v-model set.
    editorContentDidChange (value) {
      this.$store.commit('setOpenRpcModified', {
        apiId: this.apiId,
        json: JSON.parse(value)
      })
    },
    toggleDiffEditorSplitView () {
      // update diff editor instance options
      this.editors.diff.instance.updateOptions({
        renderSideBySide: !this.editors.diff.options.renderSideBySide
      })
      this.editors.diff.options.renderSideBySide = !this.editors.diff.options.renderSideBySide
    }
  }
}

</script>
