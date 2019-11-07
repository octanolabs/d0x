import Vue from "vue";
import App from "./layouts/default.vue";
import VueHighlightJS from "vue-highlightjs";
import VueClipboard from "vue-clipboard2";
import store from "./store";
import vuetify from "./plugins/vuetify";
import md from "./plugins/markdown-it";
import router from "./router";

Vue.config.productionTip = false;
Vue.use(VueHighlightJS);

VueClipboard.config.autoSetContainer = true; // modal fix
Vue.use(VueClipboard);

// inject markdown-it globally as this.$md
Vue.mixin({
  beforeCreate() {
    const options = this.$options;
    if (options.md) {
      this.$md = options.md;
    } else if (options.parent && options.parent.$md) {
      this.$md = options.parent.$md;
    }
  }
});

new Vue({
  store,
  vuetify,
  md,
  router,
  render: h => h(App)
}).$mount("#app");
