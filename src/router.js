import Vue from "vue";
import Router from "vue-router";

// views
import About from "@/views/About.vue";
import Edit from "@/views/Edit.vue";
import View from "@/views/View.vue";

Vue.use(Router);

export default new Router({
  mode: process.env.ROUTER_MODE || "hash",
  base: process.env.BASE_URL || "/",
  routes: [
    {
      path: "/",
      component: About,
      name: "Home",
    },
    {
      path: "/:apiId",
      component: View,
      name: "View",
      props: true,
    },
    {
      path: "/edit/:apiId",
      component: Edit,
      name: "Edit",
      props: true,
    },
  ],
});
