<template>
  <v-flex>
    <v-system-bar color="#222">
      <span>{{ info.title }} - {{ info.description }} </span>
      <div class="flex-grow-1"></div>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            text
            tile
            small
            v-on="on"
            v-clipboard:copy="endpoint"
            v-clipboard:success="copySuccess"
            v-clipboard:error="copyError"
          >
            <v-icon>mdi-api</v-icon>
          </v-btn>
        </template>
        <span>Click to copy API endpoint to clipboard.</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            text
            tile
            small
            v-on="on"
          >
            <v-icon :color="online ? 'success' : 'error'">mdi-wifi</v-icon>
          </v-btn>
        </template>
        <span>Status: {{ online ? 'online' : 'offline' }}</span>
      </v-tooltip>
    </v-system-bar>
    <v-snackbar
      v-model="vCopyError"
      color="error"
    >
      Unable to copy to clipboard. Copy manually or change to a supported browser.
      <v-btn
        text
        @click="vCopyError = false"
      >
        Close
      </v-btn>
    </v-snackbar>
    <v-snackbar
      v-model="vCopySuccess"
      color="primary"
    >
      {{ endpoint }} has been copied to your clipboard.
      <v-btn
        text
        @click="vCopySuccess = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </v-flex>
</template>

<script>
import axios from 'axios'

export default {
  props: ['info', 'endpoint'],
  watch: {
    endpoint: function () {
      this.checkApi()
    }
  },
  created () {
    this.checkApi()
  },
  data () {
    return {
      vCopySuccess: false,
      vCopyError: false,
      online: false
    }
  },
  methods: {
    copySuccess () {
      this.vCopySuccess = true
    },
    copyError () {
      this.vCopyError = true
    },
    checkApi () {
      // TODO - add additional types of checks, default should be rpc.discover.
      // for now however use web3_clientVersion, it applies to ubiq and etc (geth).
      axios.request({
        method: "post",
        url: this.endpoint,
        data: {
          id: 1,
          jsonrpc: "2.0",
          method: "web3_clientVersion",
          params: []
        }
      }).then(response => {
        if (response.data) {
          if (!response.data.error) {
            this.$store.commit('setClientVer', response.data.result)
            this.online = true
          } else {
            // web3_clientVersion likely unknown
            this.$store.commit('setClientVer', false)
            this.online = false
          }
        } else {
          this.online = false
        }
      }).catch(e => {
        this.$store.commit('setClientVer', false)
        this.online = false
        console.log(e)
      })
    }
  }
}
</script>
