<template>
  <v-card>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      />
      <v-spacer />
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="openrpc.methods"
      @click:row="rowSelected"
      :search="search"
      disable-pagination
      hide-default-footer
    >
      <template v-slot:item.methodId="{ item }">
        <v-flex v-if="item">
          {{ item.methodId + 1 }}
        </v-flex>
      </template>
      <template v-slot:item.params="{ item }">
        <v-flex v-if="item">
          {{ item.params.length }}
        </v-flex>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>

export default {
  props: ['openrpc'],
  data () {
    return {
      selected: [],
      search: '',
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

<style>
  .theme--dark.v-data-table tbody tr:hover:not(.v-data-table__expanded__content) {
    background: #6fceb7;
  }
</style>
