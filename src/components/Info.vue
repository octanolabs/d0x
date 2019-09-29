<template>
  <v-data-table
    :headers="headers"
    :items="info"
    hide-default-footer
    disable-sort
    disable-pagination
    disable-filtering
  >
    <template v-slot:item.url>
      <a href="#">{{ url }}</a>
    </template>
    <template v-slot:item.license="{ item }">
      <v-flex v-if="item">
        <a :href="item.license.url" target="_blank">{{ item.license.name }}</a>
      </v-flex>
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: [ 'info' ],
  computed: {
    url () {
      return this.$store.state.endpoint
    }
  },
  data () {
    return {
      headers: [
        { text: 'API', value: 'url', align: 'left' },
        { text: 'Title', value: 'title', align: 'left' },
        { text: 'Description', value: 'description', align: 'left' },
        { text: 'OpenRPC', value: 'version', align: 'left' },
        { text: 'License', value: 'license', align: 'left' },
      ]
    }
  }
}
</script>
