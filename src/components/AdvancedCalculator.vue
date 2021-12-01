<template>
  <v-container>
    <v-row>
      <v-col>
        <v-list dense>
          <v-list-item v-for="(item, key) in tableData" :key="key">
            <v-list-item-title>{{ key }}</v-list-item-title>
            <v-list-item-subtitle>{{ item }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col>
        <v-card max-width="375" class="mx-auto">
          <v-list>
            <v-list-item
              three-line
              v-for="(value, key) in position"
              :key="key"
              @click="updatePosition(value.original)"
            >
              <v-list-item-avatar color="black" tile>
                <v-img
                  height="30px"
                  width="30px"
                  :src="
                    data[value.original].isEmpty
                      ? value.icon
                      : data[value.original].main.icon
                  "
                />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  <template v-if="data[value.original].isEmpty">
                    {{ $t(value.original) }}
                  </template>
                  <template v-else>
                    <v-chip
                      small
                      label
                      :color="
                        data[value.original].activeSubposition === 0
                          ? 'primary'
                          : 'secondary'
                      "
                      @click="data[value.original].toggleActivation()"
                    >
                      {{ data[value.original].meleeAttack }}
                      {{ data[value.original].main.name }}
                    </v-chip>
                    <v-chip
                      small
                      label
                      v-if="!data[value.original].sub.isEmpty"
                      :color="
                        data[value.original].activeSubposition === 1
                          ? 'primary'
                          : 'secondary'
                      "
                      @click="data[value.original].toggleActivation()"
                    >
                      {{ data[value.original].sub.name }}
                    </v-chip>
                  </template>
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ data[value.original].activePassive1 }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  {{ data[value.original].activePassive2 }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-sheet class="wordtags">
                <v-chip
                  x-small
                  label
                  outlined
                  v-for="(tag, index) in data[value.original].wordTags"
                  :key="index"
                >
                  {{ $t(tag) }}
                </v-chip>
              </v-sheet>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <v-col>
        <v-card
          max-width="375"
          class="mx-auto part-selector"
          max-height="500px"
        >
          <v-list :key="position">
            <v-list-item
              three-line
              v-for="(value, key) in mappedParts[currentPosition]"
              :key="value.wikiUrl"
              @click="selectPart(value)"
            >
              <v-list-item-avatar color="black" tile>
                <v-img height="30px" width="30px" :src="value.icon" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{
                  $t(value.machineName)
                }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ value.melee }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  {{ value.range }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import POSITION from "@/constants/position";
import PartCombinator from "@/models/PartCombinator";

export default {
  name: "AdvancedCalculator",

  data: () => ({
    search: "",
    parts: [],
    partTypeMap: [],
    loading: true,
    showPositionPicker: false,
    currentPosition: "頭",
    headers: [
      { text: "部位", value: "position", sort: false },
      { text: "圖示", value: "image", sortable: false },
      { text: "名稱", value: "machineName" },
      { text: "耐力", value: "stamina" },
      { text: "轉換格攻", value: "accumluatedMeleeAttack" },
      { text: "轉換射攻", value: "accumluatedRangeAttack" },
      { text: "詞彙1", value: "wordTag1" },
      { text: "詞彙2", value: "wordTag2" },
      { text: "特性1/技能", value: "passive1" },
      { text: "特性2/說明", value: "passive2" },
      { text: "傷害", value: "power" },
      { text: "貫通", value: "pierce" },
    ],
    position: POSITION,
    data: {
      頭: new PartCombinator("頭"),
      胴体: new PartCombinator("胴体"),
      腕: new PartCombinator("腕"),
      脚部: new PartCombinator("脚部"),
      背中: new PartCombinator("背中"),
      盾: new PartCombinator("盾"),
      格闘武器: new PartCombinator("格闘武器"),
      射撃武器: new PartCombinator("射撃武器"),
      パイロット: new PartCombinator("パイロット"),
    },
  }),

  computed: {
    calculatedMeleeAttack() {
      return Object.values(this.data).reduce((a, b) => a + b.meleeAttack, 0);
    },
    calculatedRangeAttack() {
      return Object.values(this.data).reduce((a, b) => a + b.rangeAttack, 0);
    },
    calculatedMeleeDefense() {
      return Object.values(this.data).reduce((a, b) => a + b.meleeDefense, 0);
    },
    calculatedRangeDefense() {
      return Object.values(this.data).reduce((a, b) => a + b.rangeDefense, 0);
    },
    calculatedPhysicalResistence() {
      return Object.values(this.data).reduce(
        (a, b) => a + b.physicalResistence,
        0
      );
    },
    calculatedBeamResistence() {
      return Object.values(this.data).reduce((a, b) => a + b.beamResistence, 0);
    },
    calculatedArmor() {
      return Object.values(this.data).reduce((a, b) => a + b.armor, 0);
    },
    tableData() {
      return {
        meleeAttack: Math.round(this.calculatedMeleeAttack),
        rangeAttack: Math.round(this.calculatedRangeAttack),
        meleeDefense: Math.round(this.calculatedMeleeDefense),
        rangeDefense: Math.round(this.calculatedRangeDefense),
        physicalResistence: Math.round(this.calculatedPhysicalResistence),
        beamResistence: Math.round(this.calculatedBeamResistence),
        armor: Math.round(this.calculatedArmor),
      };
    },
    mappedParts() {
      const a = this.parts.map((part) => ({
        ...part,
        machineName: this.$t(part.machineName) || this.$t(part.aiName),
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
      const map = {};
      a.forEach((part) => {
        if (!map[part.position]) {
          map[part.position] = [];
        }
        map[part.position].push(Object.freeze(part));
      });
      return map;
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
    selectPart(part) {
      this.data[this.currentPosition].insert(part);
    },
    endCompose() {},
    updateQuery() {
      this.$router.push({
        query: {
          keyword: this.search,
        },
      });
    },
    updatePosition(position) {
      this.currentPosition = position;
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
    window.app4 = this;
    const prefix =
      process.env.NODE_ENV === "production" ? "/vue-gbm-alive/" : "/";
    axios
      .get(`${prefix}wiki.json`, {
        responseType: "json",
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
.part-selector {
  overflow-y: scroll;
}
.rainbow {
  @rainbow-colors: red, orange, yellow, green, blue;
  background: linear-gradient(to left, @rainbow-colors) !important;
}
.wordtags {
  flex: none;
  position: absolute;
  right: 0;
  top: 0;
  max-width: 60px;
  display: flex;
  flex-direction: column;
}
</style>
