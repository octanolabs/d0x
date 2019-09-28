<template>
  <v-card
    class="ma-1 code-card"
    outlined
  >
    <v-card-actions>
      <v-spacer />
      <v-tooltip
        v-model="show"
        left
      >
        <template v-slot:activator="{ on }">
          <v-btn icon color="primary" v-on="on">
            <v-icon small>mdi-refresh</v-icon>
          </v-btn>
        </template>
        <span>Refresh.</span>
      </v-tooltip>
      <v-tooltip
        v-model="show"
        left
      >
        <template v-slot:activator="{ on }">
          <v-btn icon color="primary" v-on="on">
            <v-icon small>mdi-content-copy</v-icon>
          </v-btn>
        </template>
        <span>Copy to clipboard.</span>
      </v-tooltip>
    </v-card-actions>
    <v-divider />
    <v-card-text class="pa-0">
      <pre v-highlightjs="format()"><code class="javascript w-100 elevation-0"></code></pre>
    </v-card-text>
  </v-card>
</template>

<script>
import stringifyObject from 'stringify-object'
import RandExp from 'randexp'

export default {
  props: {
    endpoint: {
      type: String,
      default: 'https://rpc.octano.dev'
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
  computed: {
    json () {
      return {
        method: 'post',
        url: this.endpoint,
        data: {
          id: 1,
          jsonrpc: '2.0',
          method: this.method,
          params: this.exampleParams()
        }
      }
    }
  },
  methods: {
    // format the code nicely
    format () {
      return 'axios.request(' + stringifyObject(this.json, {
        indent: '  ',
        singleQuotes: false,
        inlineCharacterLimit: 12
      }) + ')'
    },
    // generate example params based on method.params // TODO clean this up - iquidus
    exampleParams () {
      let eParams = []
      for (let i in this.params) {
        if (this.params[i].schema.type === 'string' && this.params[i].schema.pattern) { // not oneOf
          eParams.push(this.exampleStr(this.params[i].schema.pattern).toLowerCase())
        }
        if (this.params[i].schema.enum) {
          if (this.params[i].schema.type === 'string' && this.params[i].schema.enum.length > 0) {
            eParams.push(this.params[i].schema.enum[0])
          }
        }
        if (this.params[i].schema.type === 'boolean') {
          eParams.push(this.randBool())
        }
        if (this.params[i].schema.oneOf) {
          const x = Math.floor(Math.random() * ((this.params[i].schema.oneOf.length - 1) + 1) + 1)
          const chosenOne = this.params[i].schema.oneOf[x-1]
          console.log(chosenOne)
          if (chosenOne.type === 'string' && chosenOne.pattern) { // not oneOf
            eParams.push(this.exampleStr(chosenOne.pattern).toLowerCase())
          }
          if (chosenOne.enum) {
            if (chosenOne.type === 'string' && chosenOne.enum.length > 0) {
              eParams.push(chosenOne.enum[0])
            }
          }
          if (chosenOne.type === 'boolean') {
            eParams.push(this.randBool())
          }
        }
      }
      return eParams
    },
    // generate a random string from a regular expression pattern
    exampleStr (pattern) {
      return new RandExp(pattern).gen()
    },
    // really bad rand bool func
    randBool () {
      return this.isEven(Date.now())
    },
    isEven (n) {
      return n % 2 == 0
    }
  }
}

</script>
