const { gitDescribe , gitDescribeSync } = require('git-describe');

process.env.VUE_APP_GIT_HASH = gitDescribeSync().hash;

module.exports = {
  lintOnSave: false,

  publicPath: process.env.NODE_ENV === 'production'
    ? '/vue-gbm-alive/'
    : '/',

  transpileDependencies: [
    'vuetify',
  ],

  chainWebpack: (config) => {
    config
      .plugin('html')
      .tap((args) => {
        args[0].meta = {
          cache: { 'http-equiv': 'cache-control', content: 'no-cache' },
        };
        return args;
      });
  },

  pwa: {
    name: 'GBM alive',
    themeColor: '#0186d1',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [{
        urlPattern: new RegExp('json'),
        handler: 'networkFirst',
        options: {
          networkTimeoutSeconds: 20,
          cacheName: 'json-cache',
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      }, {
        urlPattern: new RegExp('jpg|png'),
        handler: 'cacheFirst',
        options: {
          cacheName: 'wiki-cache',
          expiration: {
            maxEntries: 5000,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
            // Automatically cleanup if quota is exceeded.
            purgeOnQuotaError: true,
          },
        },
      }],
    },
  },
};
