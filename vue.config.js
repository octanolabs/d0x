module.exports = {
  css: {
    loaderOptions: {
      // by default the `sass` option will apply to both syntaxes
      // because `scss` syntax is also processed by sass-loader underlyingly
      // but when configuring the `data` option
      // `scss` syntax requires an semicolon at the end of a statement, while `sass` syntax requires none
      // in that case, we can target the `scss` syntax separately using the `scss` option
      sass: {
        implementation: require("sass")
      }
    }
  },
  // gh-pages
  // https://cli.vuejs.org/guide/deployment.html#pwa
  publicPath: process.env.NODE_ENV === "production" ? "/d0x/" : "/"
};
