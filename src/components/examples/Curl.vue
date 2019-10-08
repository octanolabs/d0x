<template>
  <v-card
    class="ma-1 code-card"
    outlined
  >
    <v-card-actions>
      <v-subheader>Curl</v-subheader>
      <v-spacer />
      <v-tooltip
        left
      >
        <template v-slot:activator="{ on }">
          <v-btn icon color="primary" v-on="on" @click="refreshParams()">
            <v-icon small>mdi-refresh</v-icon>
          </v-btn>
        </template>
        <span>Refresh</span>
      </v-tooltip>

      <v-tooltip
        left
      >
        <template v-slot:activator="{ on }">
          <v-btn icon color="primary" v-on="on" v-clipboard:copy="format()" v-clipboard:success="copySuccess" v-clipboard:error="copyError">
            <v-icon small>mdi-content-copy</v-icon>
          </v-btn>
        </template>
        <span>Copy to clipboard</span>
      </v-tooltip>

    </v-card-actions>
    <v-divider />
    <v-card-text class="pa-0">
      <pre v-highlightjs="format()"><code class="javascript w-100 elevation-0"></code></pre>
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
import jsf from 'json-schema-faker'

export default {
  props: {
    endpoint: {
      type: String,
      default: ''
    },
    method: {
      type: String,
      default: ''
    },
    params: {
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
        id: 1,
        jsonrpc: '2.0',
        method: this.method,
        params: this.randParams
      }
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
    format () {
      return 'curl -H "Content-Type: application/json" -X POST --data \'' + JSON.stringify(this.json) + '\' "' + this.endpoint + '"'

    },
    // generate example params based on method.params // TODO clean this up - iquidus
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
