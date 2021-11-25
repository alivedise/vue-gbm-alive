<template>
  <v-container class="grey lighten-5">
    <v-row no-gutters>
      <v-col
        v-for="machine in machines"
        :key="machine.machineName"
        cols="12"
        sm="6"
      >
        <v-card class="pa-2" outlined tile height="300px">
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
        </v-card>
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
    mappedParts() {
      const a = this.parts.map((part) => ({
        ...part,
        machineName: this.$t(part.machineName),
        passive1: this.$t(part.passive1 || part.skillName),
        passive2: this.$t(part.passive2 || part.skillDescription),
        power: part.skillTable.length
          ? part.skillTable[part.skillTable.length - 1][2]
          : "",
        pierce: part.skillTable.length
          ? part.skillTable[part.skillTable.length - 1][1]
          : "",
        accumluatedMeleeAttack: Math.floor(
          +part.melee + +part.meleeDefense * 0.4
        ),
        accumluatedRangeAttack: Math.floor(
          +part.range + +part.rangeDefense * 0.4
        ),
      }));
      if (this.category && this.position[this.category]) {
        return a.filter(
          (part) => part.position === this.position[this.category].original
        );
      }
      return a;
    },

    positionList() {
      return [
        this.$t("頭"),
        this.$t("胸"),
        this.$t("手"),
        this.$t("腳"),
        this.$t("背"),
        this.$t("劍"),
        this.$t("槍"),
        this.$t("盾"),
        this.$t("AI"),
      ];
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
    endCompose() {},
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
    getPowerColor(level) {
      if (level) {
        console.log(level);
      }
      const table = {
        SS: "rainbow",
        "SS－": "rainbow",
        "S＋": "red darken-3",
        S: "red darken-2",
        "S－": "red darken-1",
        "A＋": "orange darken-3",
        A: "orange darken-2",
        "A－": "orange darken-1",
        "B＋": "yellow darken-3",
        B: "yellow darken-2",
        "B－": "yellow darken-1",
        "C＋": "blue darken-3",
        C: "blue darken-2",
        "C－": "blue darken-1",
      };
      if (table[level]) {
        return table[level];
      }
      return "black";
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
    /*axios
      .get(`${prefix}wiki.json`, {
        responseType: "json",
      })
      .then((data) => {
        const parts = data.data.wiki;
        parts.forEach((part) => {
          this.partWikiMap[part.wikiUrl] = part;
        });
        this.detailLoaded = true;
      });
      */
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
/deep/ .v-chip {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99999;
}
.detail .theme--light.v-list {
  background-color: silver;
}
</style>
