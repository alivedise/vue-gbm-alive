<template>
  <v-container class="grey lighten-5">
    <v-row no-gutters>
      <v-col
        v-for="machine in mappedMachines"
        :key="machine.machineName"
        cols="12"
        sm="3"
      >
        <v-card height="150px">
          <v-img
            height="150px"
            :src="machine.icon"
          >
            <v-app-bar
              flat
              color="rgba(0, 0, 0, 0)"
            >
              <v-app-bar-nav-icon color="white"></v-app-bar-nav-icon>

              <v-toolbar-title class="text-h6 white--text pl-0">
                <v-chip outlined label class="model">{{machine.model}}</v-chip>
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
          </v-img>
          <v-chip
            class="ma-2 machine-name"
            color="primary"
            label
          >
            <v-icon left>
              {{machine.property[0]}}
            </v-icon>
            {{$t(machine.machineName)}}
          </v-chip>
        </v-card>
        <!--v-card class="pa-2" outlined tile height="300px">
          <v-chip label>{{ machine.story }}</v-chip>
          <v-container>
            <v-row :align="align" no-gutters>
              <v-col>
                <v-img :src="machine.icon" max-height="250" max-width="150">
                </v-img>
                <v-card-text>
                  <v-row align="center" class="mx-0">
                    <v-rating
                      :value="+machine.rarity"
                      color="amber"
                      dense
                      half-increments
                      readonly
                      size="14"
                    ></v-rating>
                  </v-row>

                  <div class="my-4 text-subtitle-1">
                    {{ machine.property }}
                  </div>
                </v-card-text>
              </v-col>
              <v-col class="detail">
                <v-list dense>
                  <v-card-title>{{ machine.machineName }}</v-card-title>
                  <v-list-item-group color="primary">
                    <v-list-item v-for="(item, i) in machine.parts" :key="i">
                      <v-list-item-icon>
                        <v-img
                          v-if="
                            detailLoaded &&
                            typeof item[1] !== 'string' &&
                            partWikiMap[item[1].wikiUrl]
                          "
                          height="30px"
                          width="30px"
                          :src="partWikiMap[item[1].wikiUrl].icon"
                        />
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>{{
                          item[1].name
                        }}</v-list-item-title>
                        <v-list-item-subtitle
                          v-if="
                            detailLoaded &&
                            typeof item[1] !== 'string' &&
                            partWikiMap[item[1].wikiUrl]
                          "
                        >
                          {{ $t(partWikiMap[item[1].wikiUrl].passive1) }}
                        </v-list-item-subtitle>
                        <v-list-item-subtitle
                          v-if="
                            detailLoaded &&
                            typeof item[1] !== 'string' &&
                            partWikiMap[item[1].wikiUrl]
                          "
                        >
                          {{ $t(partWikiMap[item[1].wikiUrl].passive2) }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-col>
            </v-row>
          </v-container>
        </v-card-->
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import POSITION from "@/constants/position";

export default {
  name: "MachineDatabase",

  data: () => ({
    search: "",
    parts: [],
    partWikiMap: {},
    machines: [],
    loading: true,
    position: POSITION,
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
      this.$router.push({ path: 'revive', query: { keyword: this.$t(machineName) }});
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
        可変: "mdi-car",
        主人公機: "mdi-account-star",
        ガンダムタイプ: "mdi-robot",
        接近戦: "mdi-fencing",
        高機動: "mdi-snowmobile",
        中距離戦: "mdi-middleware",
        遠距離戦: "mdi-share-all-outline",
        宇宙適正: "",
        エース専用機: "mdi-account-tie-hat",
        高火力: "mdi-fire",
        指揮官機: "mdi-account-alert",
        モビルファイター: "mdi-hand-back-right-outline",
        重装甲: "mdi-shield",
        市街地適正: "mdi-city",
        森林適正: "mdi-forest",
        連邦: "mdi-library",
        ジムタイプ: "mdi-robot-dead-outline",
        基地適正: "mdi-airport",
        宇宙適正: "mdi-space-invaders",
        電脳適正: "mdi-desktop-classic",
        ジオン: "mdi-foot-print",
        砂漠適正: "mdi-timer-sand",
        支援機: "mdi-handshake",
        寒冷地適正: "mdi-snowflake-alert",
        量産機: "mdi-account-group",
        水陸両用: "mdi-pool",
      };
      return table[wordTag];
    },
    updateCategory(link) {
      if (this.category && link.indexOf(this.category) >= 0) {
        this.$router.push("/revive");
      } else {
        this.$router.push(link);
      }
    },
  },

  mounted() {
    window.app2 = this;
    const prefix =
      process.env.NODE_ENV === "production" ? "/vue-gbm-alive/" : "/";
    axios
      .get(`${prefix}machines.json`, {
        responseType: "json",
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
.rainbow {
  @rainbow-colors: red, orange, yellow, green, blue;
  background: linear-gradient(to left, @rainbow-colors) !important;
}

/deep/ .v-image__image.v-image__image--cover {
  background-position: center 0 !important;
}
/deep/ .v-list{
  height:260px;/* or any height you want */
  overflow-y:auto;
}
/deep/ .v-chip.model{
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
.detail .theme--light.v-list {
  background-color: silver;
}
</style>
