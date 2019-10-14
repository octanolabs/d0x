import Vue from 'vue'
import Router from 'vue-router'

// views
import About from '@/views/About.vue'
import Openrpc from '@/views/View.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: About,
      name: 'Home'
    },
    {
      path: '/:apiId',
      component: Openrpc,
      name: 'OpenRPC',
      props: true
    }
  ]
})
