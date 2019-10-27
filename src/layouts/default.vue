<template>
  <v-app>
    <v-app-bar
      :clipped-left="true"
      :clipped-right="false"
      fixed
      app
    >
      <img :src="require('../assets/octano.svg')" height="48px" style="height:48px;" class="mr-2"/>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            tile
            text
            x-large
            :to="{name: 'Home', params: {}}"
            class="pl-1 pr-1"
            :active="false"
            id="homeButton"
          >
          <v-toolbar-title v-on="on" v-text="title" />
        </v-btn>
        </template>
        <span>Home.</span>
      </v-tooltip>
      <v-spacer />
      <v-tooltip bottom v-if="selectedApi">
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            icon
            :to="{ name: editModeToggleRoute, params: { apiId: $store.state.apiId}}"
          >
            <v-icon v-if="!editMode">mdi-file-code-outline</v-icon>
            <v-icon v-else>mdi-file-document</v-icon>
          </v-btn>
        </template>
        <span v-if="!editMode">Enter editor mode.</span>
        <span v-else>Leave editor mode.</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            icon
            @click.stop="$vuetify.theme.dark = !$vuetify.theme.dark"
          >
            <v-icon v-if="$vuetify.theme.dark">mdi-weather-night</v-icon>
            <v-icon v-else>mdi-weather-sunny</v-icon>
          </v-btn>
        </template>
        <span>Toggle light/dark mode.</span>
      </v-tooltip>

      <v-menu
        left
        bottom
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            rounded
            class="ml-1"
            width="250px"
            :color="$vuetify.theme.dark ? '#333' : '#d6d6d6'"
          >
            <span v-if="selectedApi.info">
              <v-avatar size="24px" left flat>
                <img :src="require('../assets/' + selectedApi.info.icon)" height="16px" style="height:16px;width:16px;"/>
              </v-avatar>
              {{ selectedApi.info.title }}
            </span>
            <span v-else>Select an API...</span>
            <v-spacer />
            <v-icon small>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list dense class="pa-0">
          <v-list-item
            v-for="(item, i) in apis"
            :key="i"
            :to="editMode ? '/edit' + item.info.to : item.info.to"
            nav
            router
          >
            <v-list-item-action>
              <v-avatar :color="$vuetify.theme.dark ? '#222' : '#d6d6d6'" class="elevation-2">
                <img :src="require('../assets/' + item.info.icon)" height="40px" style="height:40px;width:40px;"/>
              </v-avatar>
            </v-list-item-action>
            <v-list-item-content class="api-item-content-expanded">
              <v-list-item-title v-text="item.info.title" />
              <v-list-item-subtitle v-text="item.info.url" />
              <v-list-item-subtitle v-text="item.info.desc" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-content>
      <router-view></router-view>
    </v-content>
    <right-drawer :apiId="apiId"/>
    <v-footer
      app
      fixed
    >
      <v-tooltip top v-if="selectedApi.openrpc">
        <template v-slot:activator="{ on }">
          <v-btn
            text
            tile
            small
            v-on="on"
          >
            <v-icon x-small class="mr-2">mdi-alert-circle</v-icon>
            {{ selectedApi.openrpc.error ? '1' : '0' }}
          </v-btn>
        </template>
        <span>{{ selectedApi.openrpc.error || 'No errors' }}</span>
      </v-tooltip>
      <v-tooltip top v-if="jsonPath">
        <template v-slot:activator="{ on }">
          <v-btn
            text
            tile
            small
            :href="jsonPath"
            target="_blank"
            v-on="on"
          >
            {{ jsonPath }}
          </v-btn>
        </template>
        <span>Click to open raw openrpc.json in new tab.</span>
      </v-tooltip>
      <v-tooltip top  v-if="editMode">
        <template v-slot:activator="{ on }">
          <v-btn
            text
            tile
            small
            v-on="on"
          >
            {{ editorPosition.lineNumber }}:{{ editorPosition.column }}
          </v-btn>
        </template>
        <span>Line {{ editorPosition.lineNumber }}, Column {{ editorPosition.column }}</span>
      </v-tooltip>
      <v-spacer />
      <v-tooltip
        v-if="clientVer"
        top
      >
        <template v-slot:activator="{ on }">
          <v-btn
            text
            tile
            small
            v-on="on"
          >
            {{ clientVer }}
          </v-btn>
        </template>
        <span>Client version.</span>
      </v-tooltip>
    </v-footer>
  </v-app>
</template>

<script>
import RightDrawer from '../components/RightDrawer';

export default {
  name: 'App',
  components: {
    RightDrawer
  },
  computed: {
    darkMode () {
      return this.$vuetify.theme.dark
    },
    apis () {
      return this.$store.state.apis
    },
    apiId () {
      return this.$store.state.apiId
    },
    jsonPath () {
      return this.$store.state.apis[this.$store.state.apiId] ? this.$store.state.apis[this.$store.state.apiId].info.json : ''
    },
    url () {
      return this.$store.state.apis[this.$store.state.apiId] ? this.$store.state.apis[this.$store.state.apiId].info.url : false
    },
    selectedApi () {
      return this.$store.state.apiId ? this.$store.state.apis[this.$store.state.apiId] : false
    },
    clientVer () {
      return this.$store.state.clientVer
    },
    editMode () {
      return this.$store.state.editMode
    },
    editModeToggleRoute () {
      return !this.$store.state.editMode ? 'Edit' : 'View'
    },
    editorPosition () {
      return this.$store.state.position
    }
  },
  data: () => ({
    title: 'octano-d0x'
  })
}
</script>
