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
            <openrpc-methods :data="methods" :api="apiId"/>
          </v-tab-item>
          <v-tab-item key="Schemas">
            <v-flex
              v-for="(item, i) in schemas"
              :key="i"
            >
              <openrpc-schema :item="item" :name="i"/>
            </v-flex>
          </v-tab-item>
          <v-tab-item key="Descriptors">
            <v-flex
              v-for="(item, i) in descriptors"
              :key="i"
            >
              <openrpc-schema :item="item" :name="i"/>
            </v-flex>
          </v-tab-item>
        </v-tabs-items>
      </v-sheet>
    </v-flex>
  </v-navigation-drawer>
</template>

<script>
import OpenrpcMethods from '@/components/tables/MethodsSlim'
import OpenrpcSchema from '@/components/cards/Param'

export default {
  props: ['apiId', 'methods', 'schemas', 'descriptors'],
  components: {
    OpenrpcMethods,
    OpenrpcSchema
  },
  data: () => {
    return {
      tab: 0,
      navigation: {
        shown: false,
        width: 400,
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
