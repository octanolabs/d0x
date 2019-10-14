import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    openrpc: {},
    methods: {},
    schemas: {},
    method: {},
    api: 'ubiq',
    clientVer: false,
    apis: {
      ubiq: {
        to: '/ubiq',
        icon: 'ubiq.svg',
        json: 'https://raw.githubusercontent.com/ubiq/ubiq-json-rpc-specification/master/openrpc.json',
        title: 'Ubiq (gubiq)',
        desc: 'Ubiq mainnet (gubiq)',
        url: 'https://rpc.octano.dev'
      },
      etc: {
        to: '/etc',
        icon: 'etc.svg',
        json: 'https://raw.githubusercontent.com/etclabscore/ethereum-json-rpc-specification/master/openrpc.json',
        title: 'Ethereum Classic',
        desc: 'ETC mainnet',
        url: 'https://etc-geth.0xinfra.com'
      }
    },
    showRightDrawer: false,
    showLeftDrawer: false
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
    },
    showLeftDrawer (state, show) {
      state.showLeftDrawer = show
    },
    setApi (state, payload) {
      state.api = state.apis[payload] ? payload : 'ubiq'
    },
    setClientVer (state, payload) {
      state.clientVer = payload
    },
  },
  actions: {

  }
})
