<template>
  <v-flex>
    <v-sheet style="width:100%; overflow: hidden; padding: 15px;">
      <v-chip class="mb-2" label color="secondary">{{ selected.name }}</v-chip>
      <div v-if="selected.description" v-html="$md.render(selected.description)"></div>
      <div v-else v-html="selected.summary"></div>
    </v-sheet>
    <v-sheet style="width:100%; overflow: hidden;">
      <v-tabs v-model="apiTab" grow>
        <v-tab
          v-for="tab in tabs"
          :key="tab"
          ripple
        >
          {{ tab }}
        </v-tab>
      </v-tabs>
      <v-divider />
      <v-tabs-items v-model="apiTab">
        <v-tab-item key="Request">
          <v-expansion-panels multiple accordion class="elevation-0" style="padding: 0px;">
            <v-expansion-panel>
              <v-expansion-panel-header ripple>
                <div>
                  Params
                  <v-chip v-if="selected.params" x-small color="primary"><span class="white--text">{{ selected.params.length }}</span></v-chip>
                </div>
              </v-expansion-panel-header>
              <v-expansion-panel-content style="overflow-x:auto;">
                <v-flex
                  v-for="(item, i) in selected.params"
                  :key="i"
                >
                  <openrpc-param-card :item="item" />
                </v-flex>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header ripple>
                Axios
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <axios-example :endpoint="url" :method="selected.name" :params="selected.params" />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-tab-item>
        <v-tab-item key="Response">
          <v-expansion-panels multiple accordion class="elevation-0" style="padding: 0px;">
            <v-expansion-panel>
              <v-expansion-panel-header ripple>
                Returns
              </v-expansion-panel-header>
              <v-expansion-panel-content style="overflow-x:auto;" v-if="selected.result">
                <v-list dense tile v-if="selected.result.schema.oneOf">
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title v-text="selected.result.name" />
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item
                    v-for="(item, i) in selected.result.schema.oneOf"
                    :key="i"
                  >
                    <openrpc-schema :item="item" />
                  </v-list-item>
                </v-list>
                <v-list-item v-if="selected.result.schema.type">
                  <openrpc-schema :item="selected.result.schema" />
                </v-list-item>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header ripple>
                Example
              </v-expansion-panel-header>
              <v-expansion-panel-content>

              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-tab-item>
      </v-tabs-items>
    </v-sheet>
  </v-flex>
</template>

<script>
import OpenrpcSchema from './Schema'
import OpenrpcParamCard from './Param'
import AxiosExample from './examples/Axios'

export default {
  props: ['selected'], // selected method
  components: {
    OpenrpcSchema,
    OpenrpcParamCard,
    AxiosExample
  },
  computed: {
    url () {
      return this.$store.state.endpoint
    }
  },
  data () {
    return {
      apiTab: null,
      tabs: ['Request', 'Response']
    }
  }
}
</script>
<style>
  pre {
    max-width: 100%;
    overflow-x: auto;
    background-color: transparent;
  }
  .v-expansion-panel-header {
    background-color: #555;
  }

  .v-expansion-panel-content__wrap {
    padding: 0px !important;
  }
</style>
