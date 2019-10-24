import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    drawers: {
      left: true,
      right: false
    },
    editMode: false,

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
    }
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
    toggleDrawer (state, side) {
      // side: 'left' or 'right'
      state.drawers[side] = !state.drawers[side]
    },
    setApi (state, payload) {
      state.api = state.apis[payload] ? payload : 'ubiq'
    },
    setClientVer (state, payload) {
      state.clientVer = payload
    },
    setEditMode (state, payload) {
      state.editMode = payload
    },
  },
  actions: {

  }
})
