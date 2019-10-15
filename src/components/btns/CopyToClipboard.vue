<template>
  <v-flex>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          small
          v-on="on"
          v-clipboard:copy="copy"
          v-clipboard:success="copySuccess"
          v-clipboard:error="copyError"
        >
          <v-icon small>mdi-content-copy</v-icon>
        </v-btn>
      </template>
      <span>Copy to clipboard.</span>
    </v-tooltip>
    <v-snackbar
      v-model="success"
      color="primary"
    >
      Copied to your clipboard.
      <v-btn
        text
        @click="success = false"
      >
        Close
      </v-btn>
    </v-snackbar>
    <v-snackbar
      v-model="error"
      color="error"
    >
      Unable to copy to clipboard. Copy manually or change browser.
      <v-btn
        text
        @click="error = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </v-flex>
</template>

<script>

export default {
  props: ['copy'],
  data () {
    return {
      success: false,
      error: false
    }
  },
  methods: {
    copySuccess () {
      this.success = true
    },
    copyError () {
      this.error = true
    }
  }
}
</script>
