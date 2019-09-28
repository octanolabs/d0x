import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    openrpc: {},
    methods: {},
    schemas: {},
    method: {},
    endpoint: 'https://rpc.octano.dev',
    showRightDrawer: false
  },
  mutations: {
    setOpenRpc (state, json) {
      state.openrpc = json
    },
    setSchemas (state, payload) {
      state.schemas = payload
    },
    setMethods (state, payload) {
      state.methods = payload
    },
    setMethod (state, payload) {
      state.method = payload
    },
    showRightDrawer (state, show) {
      state.showRightDrawer = show
    }
  },
  actions: {

  }
})
