module.exports = {
  css: {
    loaderOptions: {
      scss: {
        data: '@import "./scss/style.scss"'
      }
    }
  },
  // gh-pages
  // https://cli.vuejs.org/guide/deployment.html#pwa
  publicPath: process.env.NODE_ENV === 'production'
    ? '/d0x/'
    : '/'
};
