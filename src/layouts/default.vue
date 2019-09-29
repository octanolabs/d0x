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
      <v-spacer />
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
import Home from '../pages/home';
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
    leftDrawer: false,
    fixed: false,
    miniVariant: true,
    title: 'd0x.octano.dev'
  }),
};
</script>
