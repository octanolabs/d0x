import Vue from 'vue'
import Vuex from 'vuex'
import JSRP from 'json-schema-ref-parser'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    drawers: {
      left: true,
      right: false
    },
    editMode: false,
    apiId: 'ubiq',
    apis: {
      ubiq: {
        openrpc: {
          original: {
            schema: {},
            deref: {}
          },
          modified: {
            schema: {},
            deref: {}
          }
        },
        selected: 0, // selected methodId
        info: {
          to: '/ubiq',
          icon: 'ubiq.svg',
          json: 'https://raw.githubusercontent.com/ubiq/ubiq-json-rpc-specification/master/openrpc.json',
          title: 'Ubiq',
          desc: 'Ubiq mainnet',
          url: 'https://rpc.octano.dev'
        }
      },
      etc: {
        openrpc: {
          original: {
            schema: {},
            deref: {}
          },
          modified: {
            schema: {},
            deref: {}
          }
        },
        selected: {}, // selected method (dereffed)
        info: {
          to: '/etc',
          icon: 'etc.svg',
          json: 'https://raw.githubusercontent.com/etclabscore/ethereum-json-rpc-specification/master/openrpc.json',
          title: 'Ethereum Classic',
          desc: 'ETC mainnet',
          url: 'https://etc-geth.0xinfra.com'
        }
      }
    },
    clientVer: false
  },
  mutations: {
    setOpenRpcOriginal (state, payload) {
      state.apis[payload.apiId].openrpc.original.schema = payload.json
      if ( payload.modified ) {
        state.apis[payload.apiId].openrpc.modified.schema = payload.json
      }

      // JSON deep copy fuckery to prevent deref referencing payload.json (we don't want the deref going back to schema)
      JSRP.dereference(JSON.parse(JSON.stringify(payload.json)), (err, deref) => {
        if (err) {
          console.log(err)
        } else {
          let methods = deref.methods

          // add a numeric ID to each method
          let count = 0
          for (let method of methods) {
            method.methodId = count
            methods[count] = method
            count++
          }

          state.apis[payload.apiId].openrpc.original.deref = deref
          if ( payload.modified ) {
            state.apis[payload.apiId].openrpc.modified.deref = deref
          }
        }
      })
    },
    setOpenRpcModified (state, payload) {
      state.apis[payload.apiId].openrpc.modified.schema = payload.json
      // JSON deep copy fuckery to prevent deref referencing payload.json (we don't want the deref going back to schema)
      JSRP.dereference(JSON.parse(JSON.stringify(payload.json)), (err, deref) => {
        if (err) {
          console.log(err)
        } else {
          let methods = deref.methods

          // add a numeric ID to each method
          let count = 0
          for (let method of methods) {
            method.methodId = count
            methods[count] = method
            count++
          }
          state.apis[payload.apiId].openrpc.modified.deref = deref
        }
      })
    },
    setSelected (state, payload) {
      state.apis[payload.apiId].selected = payload.method
    },
    toggleDrawer (state, side) {
      // side: 'left' or 'right'
      state.drawers[side] = !state.drawers[side]
    },
    setApiId (state, payload) {
      state.apiId = state.apis[payload] ? payload : 'ubiq'
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
