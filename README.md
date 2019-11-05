[![CircleCI](https://circleci.com/gh/octanolabs/d0x/tree/master.svg?style=svg)](https://circleci.com/gh/octanolabs/d0x/tree/master)

# d0x

A vue.js based OpenRPC viewer and editor.

![Viewer](/src/assets/screenshots/1.png)
![Editor](/src/assets/screenshots/2.png)
![Diffs](/src/assets/screenshots/3.png)

## Project setup
```
npm install
```

### Environment Variables

* ROUTER_MODE: [vue-router history mode](https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations) option ('history', 'hash'). default: hash.
* BASE_URL: [base URL](https://router.vuejs.org/api/#base) of the app. For example, if the entire single page application is served under /d0x/, then base should use the value "/d0x/". default "/"

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
