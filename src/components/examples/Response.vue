<template>
  <v-card
    class="ma-1 code-card"
    outlined
  >
    <v-card-actions>
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
      Example response has been copied to your clipboard.
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

export default {
  props: ['result'],
  watch: {
    // watch for method prop change
    result: function () {
      this.res = '0x' // refresh example params with new schemas
    },
  },
  computed: {
    json () {
      return {
        id: 1,
        jsonrpc: '2.0',
        result: this.res
      }
    }
  },
  created () {
    this.res = '0x'
  },
  data () {
    return {
      res: null,
      snackCopySuccess: false,
      snackCopyError: false
    }
  },
  methods: {
    // format the code nicely
    format () {
      return stringifyObject(this.json, {
        indent: '  ',
        singleQuotes: false,
        inlineCharacterLimit: 12
      })
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
