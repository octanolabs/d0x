<template>
  <v-navigation-drawer
    :value="show"
    right
    :clipped="clipped"
    fixed
    app
    width="372px"
    floating
  >
    <v-flex>
      <v-toolbar class="elevation-0" style="background-color: #555">
        <v-btn
          icon
          @click.stop="closeRightDrawer"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Method ( {{ selected.methodId + 1 }} / {{ total }} )</v-toolbar-title>
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
    <method-details :selected="selected"/>
  </v-navigation-drawer>
</template>

<script>
import MethodDetails from './Details'

export default {
  props: [ 'clipped' ],
  components: {
    MethodDetails,
  },
  computed: {
    methods () {
      return this.$store.state.methods
    },
    selected () {
      return this.$store.state.method
    },
    show () {
      return this.$store.state.showRightDrawer
    },
    total () {
      return this.$store.state.methods.length
    }
  },
  methods: {
    closeRightDrawer () {
      this.$store.commit('showRightDrawer', false)
    },
    openRightDrawer () {
      this.$store.commit('showRightDrawer', true)
    },
    canSkipPrev () {
      return !this.selected.methodId > 0
    },
    canSkipNext () {
      return this.selected.methodId >= this.total - 1
    },
    prevOperation () {
      this.$store.commit('setMethod', this.methods[ this.selected.methodId - 1 ])
    },
    nextOperation () {
      this.$store.commit('setMethod', this.methods[ this.selected.methodId + 1 ])
    }
  }
}
</script>
