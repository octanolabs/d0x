<template>
  <v-app>
    <v-app-bar
      :clipped-left="true"
      :clipped-right="false"
      fixed
      app
    >
      <img :src="require('../assets/octano.svg')" height="48px" style="height:48px;" class="mr-2"/>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            icon
            :to="{ name: editModeToggleRoute, params: { apiId: $store.state.api}}"
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
            <v-avatar size="24px" left flat>
              <img :src="require('../assets/apis/' + selectedApi.icon)" height="16px" style="height:16px;"/>
            </v-avatar>
            {{ selectedApi.title }}
            <v-spacer />
            <v-icon small>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list dense class="pa-0">
          <v-list-item
            v-for="(item, i) in apis"
            :key="i"
            :to="editMode ? '/edit' + item.to : item.to"
            nav
            router
          >
            <v-list-item-action>
              <v-avatar :color="$vuetify.theme.dark ? '#222' : '#d6d6d6'" class="elevation-2">
                <img :src="require('../assets/apis/' + item.icon)" height="24px" style="height:32px;"/>
              </v-avatar>
            </v-list-item-action>
            <v-list-item-content class="api-item-content-expanded">
              <v-list-item-title v-text="item.title" />
              <v-list-item-subtitle v-text="item.url" />
              <v-list-item-subtitle v-text="item.desc" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-content>
      <router-view></router-view>
    </v-content>
    <right-drawer :clipped="false"/>
    <v-footer
      app
    >
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn
            text
            tile
            small
            :href="jsonPath"
            target="_blank"
            v-on="on"
          >
            <img :src="require('../assets/openrpc.png')" height="20px" class="mr-2"/>
            {{ jsonPath }}
          </v-btn>
        </template>
        <span>Click to open raw openrpc.json in new tab.</span>
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
    jsonPath () {
      return this.$store.state.apis[this.$store.state.api] ? this.$store.state.apis[this.$store.state.api].json : ''
    },
    url () {
      return this.$store.state.apis[this.$store.state.api] ? this.$store.state.apis[this.$store.state.api].url : false
    },
    selectedApi () {
      return this.$store.state.api ? this.$store.state.apis[this.$store.state.api] : this.$store.state.apis['ubiq']
    },
    clientVer () {
      return this.$store.state.clientVer
    },
    editMode () {
      return this.$store.state.editMode
    },
    editModeToggleRoute () {
      return !this.$store.state.editMode ? 'Edit' : 'View'
    }
  },
  data: () => ({
    title: 'octano-d0x'
  })
}
</script>
