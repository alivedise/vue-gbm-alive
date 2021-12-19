<template>
  <div>
    <v-container class="grey lighten-5" v-for="(machines, story) in mappedMachinesByStories" :key="story">
      <v-header>{{story}}</v-header>
      <v-row no-gutters >
        <v-col
          v-for="machine in machines"
          :key="machine.machineName"
          cols="12"
          sm="3"
        >
          <v-card height="150px">
            <v-container class="image-container">
              <AppCacheImage height="auto" :src="machine.icon">
                <v-app-bar flat color="rgba(0, 0, 0, 0)">
                  <v-app-bar-nav-icon color="white"></v-app-bar-nav-icon>

                  <v-toolbar-title class="text-h6 white--text pl-0">
                    <v-chip outlined label class="model">{{
                      machine.model
                    }}</v-chip>
                  </v-toolbar-title>

                  <v-spacer></v-spacer>

                  <v-btn
                    color="black"
                    icon
                    @click="queryByMachineName(machine.machineName)"
                  >
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </v-app-bar>
              </AppCacheImage>
            </v-container>
            <v-chip class="ma-2 machine-name" color="primary" label>
              <v-icon left>
                {{ machine.property[0] }}
              </v-icon>
              {{ $t(machine.machineName) }}
            </v-chip>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';
import AppCacheImage from '@/components/AppCacheImage.vue';

export default {
  name: 'MachineDatabase',

  components: {
    AppCacheImage,
  },

  data: () => ({
    search: '',
    parts: [],
    partWikiMap: {},
    machines: [],
    loading: true,
    detailLoaded: false,
  }),

  computed: {
    mappedMachines() {
      const map = {};
      this.machines.forEach((machine) => {
        map[machine.machineName] = machine;
      });
      const a = this.machines.filter((machine) => {
        if (machine.machineName.indexOf('【改造】') >= 0) {
          return true;
        }
        if (map[`【改造】${machine.machineName}`]) {
          return false;
        }
        return true;
      });
      return a;
    },

    mappedMachinesByStories() {
      const storyMap = {};
      this.mappedMachines.forEach((machine) => {
        if (!storyMap[machine.story]) {
          storyMap[machine.story] = [];
        }
        storyMap[machine.story].push(machine);
      });
      Object.entries(storyMap).forEach(([key, machines]) => {
        storyMap[key] = machines.sort((a, b) => {
          if (a.model === b.model) {
            return 0;
          }
          if (a.model > b.model) {
            return 1;
          }
          if (a.model < b.model) {
            return -1;
          }
        });
      });
      return storyMap;
    },

    category() {
      return this.$route.params.category;
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
    queryByMachineName(machineName) {
      this.$router.push({
        path: 'revive',
        query: { keyword: this.$t(machineName) },
      });
    },
    updateQuery() {
      this.$router.push({
        query: {
          keyword: this.search,
        },
      });
    },
    getWordTagIcon(wordTag) {
      const table = {
        可変: 'mdi-car',
        主人公機: 'mdi-account-star',
        ガンダムタイプ: 'mdi-robot',
        接近戦: 'mdi-fencing',
        高機動: 'mdi-snowmobile',
        中距離戦: 'mdi-middleware',
        遠距離戦: 'mdi-share-all-outline',
        エース専用機: 'mdi-account-tie-hat',
        高火力: 'mdi-fire',
        指揮官機: 'mdi-account-alert',
        モビルファイター: 'mdi-hand-back-right-outline',
        重装甲: 'mdi-shield',
        市街地適正: 'mdi-city',
        森林適正: 'mdi-forest',
        連邦: 'mdi-library',
        ジムタイプ: 'mdi-robot-dead-outline',
        基地適正: 'mdi-airport',
        宇宙適正: 'mdi-space-invaders',
        電脳適正: 'mdi-desktop-classic',
        ジオン: 'mdi-foot-print',
        砂漠適正: 'mdi-timer-sand',
        支援機: 'mdi-handshake',
        寒冷地適正: 'mdi-snowflake-alert',
        量産機: 'mdi-account-group',
        水陸両用: 'mdi-pool',
      };
      return table[wordTag];
    },
    updateCategory(link) {
      if (this.category && link.indexOf(this.category) >= 0) {
        this.$router.push('/revive');
      } else {
        this.$router.push(link);
      }
    },
  },

  mounted() {
    window.app2 = this;
    this.$vuetify.theme.dark = false;
    const prefix =
      process.env.NODE_ENV === 'production' ? '/vue-gbm-alive/' : '/';
    axios
      .get(`${prefix}machines.json`, {
        responseType: 'json',
      })
      .then((data) => {
        this.loading = false;
        this.machines = data.data.machines;
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
