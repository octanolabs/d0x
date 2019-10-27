<template>
  <resizable-drawer side="right">
    <v-flex>
      <v-toolbar class="elevation-0 drawer-toolbar">
        <v-btn
          icon
          @click.stop="closeDrawer"
          v-if="!editMode"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Method ( {{ selected + 1 }} / {{ methods.length }} )</v-toolbar-title>
        <v-spacer />
        <v-btn
          icon
          :disabled="canSkipPrev()"
          @click.stop="prevOperation"
        >
          <v-icon>mdi-skip-previous</v-icon>
        </v-btn>
        <v-btn
          icon
          :disabled="canSkipNext()"
          @click.stop="nextOperation"
        >
          <v-icon>mdi-skip-next</v-icon>
        </v-btn>
      </v-toolbar>
    </v-flex>
    <method-details v-if="methods[selected]" :selected="methods[selected]"/>
  </resizable-drawer>
</template>

<script>
import MethodDetails from './Details'
import ResizableDrawer from '@/components/drawers/Resizable'

export default {
  components: {
    MethodDetails,
    ResizableDrawer
  },
  computed: {
    methods () {
      return this.$store.state.apis[this.$store.state.apiId] ? this.$store.state.apis[this.$store.state.apiId].openrpc.document[this.openrpcType].deref.methods : []
    },
    selected () {
      return this.$store.state.apis[this.$store.state.apiId] ? this.$store.state.apis[this.$store.state.apiId].selected : 0
    },
    editMode () {
      return this.$store.state.editMode
    },
    openrpcType () {
      return this.$store.state.editMode ? 'modified' : 'original'
    }
  },
  methods: {
    closeDrawer () {
      this.$store.commit('toggleDrawer', 'right')
    },
    canSkipPrev () {
      return !this.selected > 0
    },
    canSkipNext () {
      return this.selected >= this.methods.length - 1
    },
    prevOperation () {
      this.$store.commit('setSelected', { apiId: this.$store.state.apiId, method: this.selected - 1 })
    },
    nextOperation () {
      this.$store.commit('setSelected', { apiId: this.$store.state.apiId, method: this.selected + 1 })
    }
  }
}
</script>
