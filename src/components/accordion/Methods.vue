<template>
  <v-card>
    <v-expansion-panels
      accordion
      mandatory
      v-model="selected"
    >
      <v-expansion-panel
        v-for="(item,i) in data"
        :key="i"
      >
        <v-expansion-panel-header hide-actions>{{ item.name }}</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card class="text-left" flat>
            <v-flex class="pa-3">
              {{ item.summary }}
            </v-flex>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script>

export default {
  props: ['data', 'apiId'],
  computed: {
    selected: {
      get: function () {
        return this.$store.state.apis[this.apiId].selected
      },
      set: function (value) {
        this.$store.commit('setSelected', { apiId: this.apiId, method: value })
      }
    }
  }
}
</script>
