<template>
  <v-card
    class="ma-1"
    outlined
  >
    <v-card-title>
      <span class="title">{{ item.name }}</span>
      <v-spacer />
      <v-tooltip
        v-if="schema.oneOf"
        left
      >
        <template v-slot:activator="{ on }">
          <v-btn icon color="secondary" v-on="on">
            <v-icon small>mdi-radiobox-marked</v-icon>
          </v-btn>
        </template>
        <span>One Of</span>
      </v-tooltip>
      <v-tooltip
        v-if="item.required === true"
        left
      >
        <template v-slot:activator="{ on }">
          <v-btn icon color="secondary" v-on="on">
            <v-icon small>mdi-asterisk</v-icon>
          </v-btn>
        </template>
        <span>Required</span>
      </v-tooltip>
    </v-card-title>
    <v-card-text v-if="!schema.oneOf">
      <div v-if="desc" v-html="$md.render(desc)"></div>
    </v-card-text>
    <v-card-actions v-if="!schema.oneOf">
      <v-btn color="primary">{{ schema.type }}</v-btn>
      <v-spacer />
      <v-chip v-if="schema.pattern" pill small color="secondary">{{ schema.pattern }}</v-chip>
      <v-chip v-if="schema.enum" pill small color="secondary">{{ schema.enum.toString() }}</v-chip>
    </v-card-actions>
    <v-flex v-if="schema.oneOf">
      <v-card
        v-for="(item, i) in schema.oneOf"
        :key="i"
        class="ma-2"
        outlined
      >
        <v-card-text>
          <div v-if="item.description" v-html="$md.render(item.description)"></div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary">{{ item.type }}</v-btn>
          <v-spacer />
          <v-chip v-if="item.pattern" pill small color="secondary">{{ item.pattern }}</v-chip>
          <v-flex v-if="item.enum" text-right>
            <v-chip
              v-for="(str, i) in item.enum"
              :key="i"
              pill
              small
              color="secondary"
              style="margin-left:2px;"
            >
              {{ str }}
            </v-chip>
          </v-flex>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-card>
</template>

<script>

export default {
  props: ['item'],
  computed: {
    desc () {
      return this.item.description || this.item.schema.description
    },
    schema () {
      return this.item.schema
    }
  }
}

</script>
