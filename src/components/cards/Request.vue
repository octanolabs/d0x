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
      <copy-to-clipboard :copy="format(mode)" tooltip="left" color="primary"/>
    </v-card-actions>
    <v-divider />
    <v-card-text class="pa-0">
      <pre v-highlightjs="format(mode)"><code class="javascript w-100 elevation-0"></code></pre>
    </v-card-text>
  </v-card>
</template>

<script>
import stringifyObject from 'stringify-object'
import jsf from 'json-schema-faker'
import CopyToClipboard from '@/components/btns/CopyToClipboard'

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
  components: {
    CopyToClipboard
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
      randParams: []
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
    }
  }
}

</script>
