<template>
  <v-img
    v-bind="$props"
    :src="mappedSrc"
    @error="onError"
  >
    <slot />
  </v-img>
</template>

<script>
export default {
  name: 'AppCacheImage',
  props: ['height', 'width', 'src', 'position'],
  data() {
    return {
      failed: false,
    }
  },
  computed: {
    mappedSrc() {
      return this.failed ? this.src : this.localSrc;
    },
    localSrc() {
      return require(`../../src/images/${(this.src || '').split('/').reverse()[0]}`);
    },
  },
  methods: {
    onError() {
      this.failed = true;
    },
  },
  mounted() {
    window.tac = this;
  },
}
</script>

<style>

</style>