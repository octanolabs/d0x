<template>
  <span>
    <v-tooltip
      :bottom="tooltip === 'bottom' || !tooltip"
      :left="tooltip === 'left'"
      :top="tooltip === 'top'"
      :right="tooltip === 'right'"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          :color="color"
          :icon="type === 'icon' || !type"
          :text="type === 'text'"
          :x-small="btnSize === 'x-small'"
          :small="btnSize === 'small'"
          :large="btnSize === 'large'"
          :x-large="btnSize === 'x-large'"
          v-on="on"
          v-clipboard:copy="copy"
          v-clipboard:success="copySuccess"
          v-clipboard:error="copyError"
        >
          <v-icon
            v-if="type === 'icon' || !type"
            :x-small="iconSize === 'x-small'"
            :small="iconSize === 'small' || !iconSize"
            :large="iconSize === 'large'"
            :x-large="iconSize === 'x-large'"
          >
            {{ content || "mdi-content-copy" }}
          </v-icon>
          <span v-else>
            {{ content }}
          </span>
        </v-btn>
      </template>
      <span>Copy to clipboard.</span>
    </v-tooltip>
    <v-snackbar v-model="success" color="primary">
      Copied to your clipboard.
      <v-btn text @click="success = false">
        Close
      </v-btn>
    </v-snackbar>
    <v-snackbar v-model="error" color="error">
      Unable to copy to clipboard. Copy manually or change browser.
      <v-btn text @click="error = false">
        Close
      </v-btn>
    </v-snackbar>
  </span>
</template>

<script>
export default {
  props: ["copy", "tooltip", "btnSize", "iconSize", "color", "type", "content"],
  data() {
    return {
      success: false,
      error: false
    };
  },
  methods: {
    copySuccess() {
      this.success = true;
    },
    copyError() {
      this.error = true;
    }
  }
};
</script>
