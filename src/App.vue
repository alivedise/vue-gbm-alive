<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <h2 class="d-flex align-center">
        鋼彈創壞者Mobile資料庫 :Revive by @alivedise
      </h2>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/alivedise/vue-gbm-alive"
        target="_blank"
        text
      >
        <span class="mr-2">v0.0.1 build-{{buildID}}</span>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    window.app = this;
    setTimeout(() => {
      if (window.location.hash === '#/') {
        this.$router.push('/revive');
      }
    }, 1000);
  },
  computed: {
    buildID() {
      return process.env.VUE_APP_GIT_HASH;
    },
  },
};
</script>
