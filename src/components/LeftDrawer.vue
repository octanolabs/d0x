<template>
  <resizable-drawer side="left">
    <v-flex class="text-center">
      <v-sheet style="width:100%; overflow: hidden;">
        <v-tabs v-model="tab" grow>
          <v-tab ripple>
            Methods
          </v-tab>
          <v-tab ripple>
            Schemas
          </v-tab>
          <v-tab ripple>
            Descriptors
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item key="Methods">
            <openrpc-methods :data="methods" :apiId="apiId"/>
          </v-tab-item>
          <v-tab-item key="Schemas">
            <v-flex
              v-for="(item, i) in schemas"
              :key="i"
            >
              <openrpc-param :item="item" :name="i"/>
            </v-flex>
          </v-tab-item>
          <v-tab-item key="Descriptors">
            <v-flex
              v-for="(item, i) in descriptors"
              :key="i"
            >
              <openrpc-param :item="item" :name="i"/>
            </v-flex>
          </v-tab-item>
        </v-tabs-items>
      </v-sheet>
    </v-flex>
  </resizable-drawer>
</template>

<script>
import OpenrpcMethods from '@/components/accordion/Methods'
import OpenrpcParam from '@/components/cards/Param'
import ResizableDrawer from '@/components/drawers/Resizable'

export default {
  props: ['apiId', 'methods', 'schemas', 'descriptors'],
  components: {
    OpenrpcMethods,
    OpenrpcParam,
    ResizableDrawer
  },
  data: () => {
    return {
      tab: 0
    }
  }
}
</script>
