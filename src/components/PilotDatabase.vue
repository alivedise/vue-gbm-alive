<template>
  <div>
    <v-container class="grey lighten-5">
      <v-row no-gutters>
        <v-col
          v-for="pilot in mappedPilots"
          :key="pilot.aiName"
          cols="12"
          sm="2"
        >
          <v-card height="150px">
            <v-container class="image-container">
              <v-img height="auto" :src="pilot.aiImage">
                <v-app-bar flat color="rgba(0, 0, 0, 0)">
                  <v-spacer></v-spacer>

                  <v-btn
                    color="black"
                    icon
                    @click="queryByAiName(pilot.aiName)"
                  >
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </v-app-bar>
              </v-img>
            </v-container>
            <v-chip class="ma-2 machine-name" color="primary" label>
              <v-icon left>
                {{ pilot.property[0] }}
              </v-icon>
              {{ $t(pilot.aiName) }}
            </v-chip>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PilotDatabase',

  data: () => ({
    search: '',
    parts: [],
    loading: true,
  }),

  computed: {
    mappedPilots() {
      const map = {};
      this.parts.forEach((part) => {
        if (!part.aiName) {
          return;
        }
        map[part.aiName] = part;
      });
      const a = this.parts.filter((part) => {
        if (!part.aiName) {
          return false;
        }
        if (part.aiName.indexOf('【改造】') >= 0) {
          return true;
        }
        if (map[`【改造】${part.aiName}`]) {
          return false;
        }
        return true;
      });
      return a;
    },

    keyword() {
      return this.$route.query.keyword;
    },
  },

  watch: {
    keyword(val) {
      this.search = val;
    },
  },

  methods: {
    queryByAiName(aiName) {
      this.$router.push({
        path: 'revive',
        query: { keyword: this.$t(aiName) },
      });
    },
  },

  mounted() {
    window.app3 = this;
    const prefix =
      process.env.NODE_ENV === 'production' ? '/vue-gbm-alive/' : '/';
    axios
      .get(`${prefix}wiki.json`, {
        responseType: 'json',
      })
      .then((data) => {
        this.loading = false;
        this.parts = data.data.wiki;
      });
    this.search = this.keyword;
  },
};
</script>

<style lang="less" scoped>
/deep/ .v-image__image.v-image__image--cover {
  background-position: center 0 !important;
}
/deep/ .v-list {
  height: 260px; /* or any height you want */
  overflow-y: auto;
}
/deep/ .v-chip.model {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99999;
}
/deep/ .v-chip.machine-name {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 99999;
}
/deep/ .image-container {
  height: 100%;
  overflow-y: scroll;
}
.detail .theme--light.v-list {
  background-color: silver;
}
</style>
