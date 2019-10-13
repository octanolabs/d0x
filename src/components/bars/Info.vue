<template>
  <v-flex>
    <v-system-bar color="#222">
      <span>{{ info.title }} - {{ info.description }} </span>
      <div class="flex-grow-1"></div>
      <v-icon>mdi-json</v-icon>
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
      <v-icon>mdi-wifi</v-icon>
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
export default {
  props: ['info', 'endpoint', 'jsonUrl'],
  data () {
    return {
      vCopySuccess: false,
      vCopyError: false
    }
  },
  methods: {
    copySuccess () {
      this.vCopySuccess = true
    },
    copyError () {
      this.vCopyError = true
    }
  }
}
</script>
