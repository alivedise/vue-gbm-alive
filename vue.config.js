module.exports = {
  lintOnSave: false,

  publicPath: process.env.NODE_ENV === 'production'
    ? '/vue-gbm-alive/'
    : '/',

  transpileDependencies: [
    'vuetify',
  ],

  pwa: {
    name: 'GBM alive',
    themeColor: '#4DBA87',
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
      }],
    },
  },
};
