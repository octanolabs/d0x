<template>
  <v-card class="ma-1 code-card" outlined>
    <v-card-actions>
      <v-spacer />
      <v-tooltip left>
        <template v-slot:activator="{ on }">
          <v-btn icon color="primary" v-on="on" @click="refreshResponse()">
            <v-icon small>mdi-refresh</v-icon>
          </v-btn>
        </template>
        <span>Refresh</span>
      </v-tooltip>
      <copy-to-clipboard :copy="format()" tooltip="left" color="primary" />
    </v-card-actions>
    <v-divider />
    <v-card-text class="pa-0">
      <pre
        v-highlightjs="format()"
      ><code class="javascript w-100 elevation-0"></code></pre>
    </v-card-text>
  </v-card>
</template>

<script>
import stringifyObject from "stringify-object";
import jsf from "json-schema-faker";
import CopyToClipboard from "@/components/btns/CopyToClipboard";

export default {
  props: ["result"],
  components: {
    CopyToClipboard
  },
  watch: {
    // watch for result prop change
    result: function() {
      this.refreshResponse();
    }
  },
  computed: {
    json() {
      return {
        id: 1,
        jsonrpc: "2.0",
        result: this.res
      };
    }
  },
  created() {
    this.res = jsf.generate(this.result.schema);
  },
  data() {
    return {
      res: null
    };
  },
  methods: {
    // format the code nicely
    format() {
      return stringifyObject(this.json, {
        indent: "  ",
        singleQuotes: false,
        inlineCharacterLimit: 12
      });
    },
    refreshResponse() {
      this.res = jsf.generate(this.result.schema);
    }
  }
};
</script>
