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
        <v-expansion-panel-header>{{ item.name }}</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card flat>
            <v-card-content class="text-left">
              <v-flex class="pa-3">
                {{ item.summary }}
              </v-flex>
            </v-card-content>
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
                      mdi-unfold-more-vertical
                    </v-icon>
                  </v-btn>
                </template>
                <span>See more..</span>
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
      return this.$store.state.method.methodId
    },
    selectedApi () {
      return this.$store.state.api
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
      this.$store.commit('setMethod', item)
      if (!this.$store.state.drawers.right) {
        this.$store.commit('toggleDrawer', 'right')
      }
    }
  }
}
</script>
