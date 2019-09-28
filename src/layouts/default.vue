<template>
  <v-app>
    <v-navigation-drawer
      v-model="leftDrawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
      floating
    >
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      :clipped-right="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="clipped = !clipped"
      >
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="fixed = !fixed"
      >
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
    </v-app-bar>
    <v-content>
      <v-container>
        <home />
      </v-container>
    </v-content>
    <right-drawer :clipped="clipped"/>
    <v-footer
      :fixed="fixed"
      app
    >
      <span>&copy; 2019</span>
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
  data: () => ({
    clipped: false,
    leftDrawer: false,
    fixed: false,
    miniVariant: false,
    title: 'openrpc-sandbox'
  }),
};
</script>
