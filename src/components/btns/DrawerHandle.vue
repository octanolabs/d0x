<template>
  <v-tooltip :left="side === 'right'" :right="side === 'left'">
    <template v-slot:activator="{ on }">
      <v-btn
        color="secondary"
        @click.stop="toggleDrawer()"
        :class="{ 'drawer-handle': true, left: left, right: right }"
        v-on="on"
      >
        <v-icon
          v-if="expanded"
          :class="{ 'pl-0': left, 'pr-2': left, 'pl-2': right, 'pr-0': right }"
        >
          {{ left ? "mdi-chevron-left" : "mdi-chevron-right" }}
        </v-icon>
        <v-icon
          v-else
          :class="{ 'pl-0': left, 'pr-2': left, 'pl-2': right, 'pr-0': right }"
        >
          {{ left ? "mdi-chevron-right" : "mdi-chevron-left" }}
        </v-icon>
      </v-btn>
    </template>
    <span v-if="expanded">Hide</span>
    <span v-else>Expand</span>
  </v-tooltip>
</template>

<script>
export default {
  props: ["side"],
  computed: {
    left() {
      return this.side === "left";
    },
    right() {
      return this.side === "right";
    },
    expanded() {
      return this.$store.state.drawers[this.side];
    },
  },
  methods: {
    toggleDrawer() {
      this.$store.commit("toggleDrawer", this.side);
    },
  },
};
</script>
