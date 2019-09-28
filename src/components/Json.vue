<template>
  <pre v-highlightjs="pretty(json)"><code class="javascript"></code></pre>
</template>

<script>
import stringifyObject from 'stringify-object'

export default {
  props: {
    json: {
      type: Object
    }
  },
  methods: {
    pretty (json) {
      return stringifyObject(json, {
        indent: '  ',
        singleQuotes: false,
        inlineCharacterLimit: 12
      })
    }
  }
}

</script>
