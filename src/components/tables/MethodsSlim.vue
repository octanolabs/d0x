<template>
  <v-card>
    <v-expansion-panels
      mandatory
      accordion
    >
      <v-expansion-panel
        v-for="(item,i) in data"
        :key="i"
      >
        <v-expansion-panel-header>{{item.name }}</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card flat>
            <v-card-content>
              {{ item.summary }}
            </v-card-content>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script>

export default {
  props: ['data', 'api'],
  computed: {
    selectedId () {
      return this.$store.state.method.methodId
    },
    selectedApi () {
      return this.$store.state.api
    }
  },
  data () {
    return {
      search: '',
      expanded: [],
      showInfoDrawer: false,
      headers: [
        { text: '#', value: 'methodId', align: 'left' },
        { text: 'Method', value: 'name', align: 'left' },
        { text: 'Summary', value: 'summary', align: 'left' },
        { text: 'Params', value: 'params', align: 'center' }
      ]
    }
  },
  methods: {
    rowSelected (item) {
      this.$store.commit('setMethod', item)
      if (!this.$store.state.showRightDrawer) {
        this.$store.commit('showRightDrawer', true)
      }
    }
  }
}
</script>
