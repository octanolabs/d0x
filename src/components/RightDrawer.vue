<template>
  <v-navigation-drawer
    ref="drawer"
    :value="show"
    right
    :clipped="false"
    app
    :width="navigation.width"
  >
    <v-flex>
      <v-toolbar class="elevation-0 drawer-toolbar">
        <v-btn
          icon
          @click.stop="closeDrawer"
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
  components: {
    MethodDetails,
  },
  data: () => {
    return {
      navigation: {
        shown: false,
        width: 372,
        borderSize: 3
      }
    }
  },
  computed: {
    methods () {
      return this.$store.state.apis[this.$store.state.apiId].openrpc.original.deref.methods
    },
    direction() {
      return this.$store.state.drawers.right === false ? "Open" : "Closed";
    },
    selected () {
      return this.$store.state.apis[this.$store.state.apiId].selected
    },
    show () {
      return this.$store.state.drawers.right
    },
    total () {
      return this.$store.state.apis[this.$store.state.apiId].openrpc.original.deref.methods.length
    }
  },
  methods: {
    closeDrawer () {
      this.$store.commit('toggleDrawer', 'right')
    },
    canSkipPrev () {
      return !this.selected.methodId > 0
    },
    canSkipNext () {
      return this.selected.methodId >= this.total - 1
    },
    prevOperation () {
      this.$store.commit('setSelected', { apiId: this.$store.state.apiId, method: this.methods[ this.selected.methodId - 1 ]})
    },
    nextOperation () {
      this.$store.commit('setSelected', { apiId: this.$store.state.apiId, method: this.methods[ this.selected.methodId + 1 ]})
    },
    setBorderWidth() {
      let i = this.$refs.drawer.$el.querySelector(
        ".v-navigation-drawer__border"
      );
      i.style.width = this.navigation.borderSize + "px";
      i.style.cursor = "ew-resize";
    },
    setEvents() {
      const minSize = this.navigation.borderSize;
      const el = this.$refs.drawer.$el;
      const drawerBorder = el.querySelector(".v-navigation-drawer__border");
      const vm = this;
      const direction = el.classList.contains("v-navigation-drawer--right")
        ? "right"
        : "left";

      function resize(e) {
        document.body.style.cursor = "ew-resize";
        let f = direction === "right"
          ? document.body.scrollWidth - e.clientX
          : e.clientX;
        el.style.width = f + "px";
      }

      drawerBorder.addEventListener(
        "mousedown",
        function(e) {
          if (e.offsetX < minSize) {
            // m_pos = e.x;
            el.style.transition ='initial'; document.addEventListener("mousemove", resize, false);
          }
        },
        false
      );

      document.addEventListener(
        "mouseup",
        function() {
          el.style.transition ='';
          vm.navigation.width = el.style.width;
          document.body.style.cursor = "";
          document.removeEventListener("mousemove", resize, false);
        },
        false
      );
    }
  },
  mounted() {
    this.setBorderWidth();
    this.setEvents();
  }
}
</script>
