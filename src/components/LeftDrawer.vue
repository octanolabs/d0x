<template>
  <v-navigation-drawer
    ref="drawer"
    app
    left
    clipped
    :width="navigation.width"
    :value="show"
  >
    <v-flex class="text-center">
      <v-sheet style="width:100%; overflow: hidden;">
        <v-tabs v-model="tab" grow>
          <v-tab ripple>
            Methods
          </v-tab>
          <v-tab ripple>
            Schemas
          </v-tab>
          <v-tab ripple>
            Descriptors
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item key="Methods">
            <openrpc-methods :data="methods" :apiId="apiId"/>
          </v-tab-item>
          <v-tab-item key="Schemas">
            <v-flex
              v-for="(item, i) in schemas"
              :key="i"
            >
              <openrpc-param :item="item" :name="i"/>
            </v-flex>
          </v-tab-item>
          <v-tab-item key="Descriptors">
            <v-flex
              v-for="(item, i) in descriptors"
              :key="i"
            >
              <openrpc-param :item="item" :name="i"/>
            </v-flex>
          </v-tab-item>
        </v-tabs-items>
      </v-sheet>
    </v-flex>
  </v-navigation-drawer>
</template>

<script>
import OpenrpcMethods from '@/components/accordion/Methods'
import OpenrpcParam from '@/components/cards/Param'

export default {
  props: ['apiId', 'methods', 'schemas', 'descriptors'],
  components: {
    OpenrpcMethods,
    OpenrpcParam
  },
  data: () => {
    return {
      tab: 0,
      navigation: {
        shown: false,
        width: 372,
        borderSize: 3
      }
    }
  },
  computed: {
    direction() {
      return this.$store.state.drawers.left === false ? "Open" : "Closed";
    },
    show () {
      return this.$store.state.drawers.left
    }
  },
  methods: {
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
