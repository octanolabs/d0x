<template>
  <v-app>
    <v-navigation-drawer
      v-model="leftDrawer"
      :mini-variant="miniVariant"
      :clipped="true"
      fixed
      app
      floating
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>

        <v-subheader
          v-if="!miniVariant"
        >
          Ubiq
        </v-subheader>

        <v-list-item
          v-for="(item, i) in ubiq"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-avatar :color="$vuetify.theme.dark ? '#666' : '#d6d6d6'" class="elevation-2">
              <img :src="require('../assets/apis/' + item.icon)" height="24px" style="height:32px;"/>
            </v-avatar>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="true"
      :clipped-right="false"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="leftDrawer = !leftDrawer" />
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn
        icon
        color="primary"
        @click.stop="$vuetify.theme.dark = !$vuetify.theme.dark"
      >
        <v-icon v-if="$vuetify.theme.dark">mdi-weather-night</v-icon>
        <v-icon v-else>mdi-weather-sunny</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container>
        <home />
      </v-container>
    </v-content>
    <right-drawer :clipped="false"/>
    <v-footer
      :fixed="fixed"
      app
    >
      <span>&copy; 2019</span>
      <v-spacer />
    </v-footer>
  </v-app>
</template>

<script>
import Home from '@/views/Home';
import RightDrawer from '../components/RightDrawer';

export default {
  name: 'App',
  components: {
    Home,
    RightDrawer,
  },
  computed: {
    darkMode () {
      return this.$vuetify.theme.dark
    }
  },
  data: () => ({
    leftDrawer: true,
    fixed: false,
    miniVariant: true,
    title: 'd0x.octano.dev',
    ubiq: [
      {
        icon: 'ubiq.svg',
        title: 'Go-ubiq (gubiq)',
        url: 'https://rpc.octano.dev'
      }
    ],
    custom: []
  }),
};
</script>
