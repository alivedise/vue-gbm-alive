module.exports = {
  lintOnSave: false,

  transpileDependencies: [
    'vuetify',
  ],

  pwa: {
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
