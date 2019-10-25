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
      :items="data"
      item-key="methodId"
      :search="search"
      disable-pagination
      hide-default-footer
      class="highlight-row"
    >
      <template v-slot:body="{ items }">
        <tbody>
          <tr
            :class="item.methodId === selectedId && api === selectedApi? 'custom-highlight-row' : ''"
            @click.stop="rowSelected(item)"
            v-for="(item) in items"
            :key="item.methodId"
          >
            <td class="text-left">{{ item.methodId + 1 }}</td>
            <td class="text-left">{{ item.name }}</td>
            <td class="text-left">{{ item.summary }}</td>
            <td class="text-center">{{ item.params.length }}</td>
          </tr>
        </tbody>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>

export default {
  props: ['data', 'api'],
  computed: {
    selectedId () {
      return this.$store.state.apis[this.$store.state.apiId].selected
    },
    selectedApi () {
      return this.$store.state.apiId
    }
  },
  data () {
    return {
      search: '',
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
      this.$store.commit('setSelected', { apiId: this.api, method: item.methodId })
      if (!this.$store.state.drawers.right) {
        this.$store.commit('toggleDrawer', 'right')
      }
    }
  }
}
</script>
