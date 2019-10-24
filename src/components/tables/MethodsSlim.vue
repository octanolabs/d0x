<template>
  <v-card>
    <v-expansion-panels>
      <v-expansion-panel
        v-for="(item,i) in data"
        :key="i"
      >
        <v-expansion-panel-header>{{ item.name }}</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card class="text-left" flat>
            <v-flex class="pa-3">
              {{ item.summary }}
            </v-flex>
            <v-divider />
            <v-card-actions>
              <v-spacer />
              <v-tooltip
                left
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    icon
                    color="primary"
                    small
                    @click.stop="rowSelected(item)"
                  >
                    <v-icon>
                      mdi-chevron-right
                    </v-icon>
                  </v-btn>
                </template>
                <span>Open..</span>
              </v-tooltip>
            </v-card-actions>
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
      return this.$store.state.apis[this.$store.state.apiId].selected.methodId
    },
    selectedApi () {
      return this.$store.state.apiId
    }
  },
  data () {
    return {
      expanded: [],
      showInfoDrawer: false
    }
  },
  methods: {
    rowSelected (item) {
      this.$store.commit('setSelected', { apiId: this.api, method: item })
      if (!this.$store.state.drawers.right) {
        this.$store.commit('toggleDrawer', 'right')
      }
    }
  }
}
</script>
