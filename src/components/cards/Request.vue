<template>
  <v-card
    class="ma-1 code-card"
    outlined
  >
    <v-card-actions>
      <v-subheader>{{ mode.charAt(0).toUpperCase() + mode.slice(1) }}</v-subheader>
      <v-spacer />
      <v-tooltip
        left
      >
        <template v-slot:activator="{ on }">
          <v-btn :disabled="disableRefresh" icon color="primary" v-on="on" @click="refreshParams()">
            <v-icon small>mdi-refresh</v-icon>
          </v-btn>
        </template>
        <span>Refresh</span>
      </v-tooltip>

      <v-tooltip
        left
      >
        <template v-slot:activator="{ on }">
          <v-btn icon color="primary" v-on="on" v-clipboard:copy="format(mode)" v-clipboard:success="copySuccess" v-clipboard:error="copyError">
            <v-icon small>mdi-content-copy</v-icon>
          </v-btn>
        </template>
        <span>Copy to clipboard</span>
      </v-tooltip>

    </v-card-actions>
    <v-divider />
    <v-card-text class="pa-0">
      <pre v-highlightjs="format(mode)"><code class="javascript w-100 elevation-0"></code></pre>
    </v-card-text>
    <v-snackbar
      v-model="snackCopySuccess"
      color="primary"
    >
      Example code has been copied to your clipboard.
      <v-btn
        text
        @click="snackCopySuccess = false"
      >
        Close
      </v-btn>
    </v-snackbar>
    <v-snackbar
      v-model="snackCopyError"
      color="error"
    >
      Unable to copy to clipboard. Copy manually or change browser.
      <v-btn
        text
        @click="snackCopyError = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
import stringifyObject from 'stringify-object'
import jsf from 'json-schema-faker'

export default {
  props: {
    mode: {  // axios, curl
      type: String,
      default: 'curl'
    },
    endpoint: { // api url endpoint e.g 'https://rpc.octano.dev'
      type: String,
      default: ''
    },
    method: { // rpc method e.g 'eth_blockNumber'
      type: String,
      default: ''
    },
    params: { // request params
      type: Array,
      default () {
        return []
      }
    }
  },
  watch: {
    // watch for method prop change
    method: function () {
      this.refreshParams() // refresh example params with new schemas
    },
  },
  computed: {
    json () {
      return {
        method: 'post',
        url: this.endpoint,
        data: {
          id: 1,
          jsonrpc: '2.0',
          method: this.method,
          params: this.randParams
        }
      }
    },
    disableRefresh () {
      return !this.params.length > 0
    }
  },
  created () {
    this.randParams = this.exampleParams()
  },
  data () {
    return {
      randParams: [],
      snackCopySuccess: false,
      snackCopyError: false
    }
  },
  methods: {
    // format the code nicely
    format (m) {
      if (m === 'axios') {
        return 'axios.request(' + stringifyObject(this.json, {
          indent: '  ',
          singleQuotes: false,
          inlineCharacterLimit: 12
        }) + ')'
      } else { // curl
        return 'curl -H "Content-Type: application/json" -X POST --data \'' + JSON.stringify(this.json.data) + '\' "' + this.endpoint + '"'
      }
    },
    exampleParams () {
      jsf.option({
        requiredOnly: false,
        alwaysFakeOptionals: true
      })
      let eParams = []
      for (let i in this.params) {
        eParams.push(jsf.generate(this.params[i].schema))
      }
      return eParams
    },
    refreshParams () {
      this.randParams = this.exampleParams()
    },
    copySuccess () {
      this.snackCopySuccess = true
    },
    copyError () {
      this.snackCopyError = true
    }
  }
}

</script>
