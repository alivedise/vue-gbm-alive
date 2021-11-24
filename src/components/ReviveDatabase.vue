<template>
  <div>
    <v-sheet color="white" elevation="1" height="100">
      <v-chip
        color="grey"
        label
        :text-color="category === key ? 'black':'white'"
        v-for="(value, key) in position"
        :key="key"
        :outlined="category === key"
        @click="updateCategory(`/revive/${key}`)"
      >
        <v-img height="30px" width="30px" :src="value.icon" />
        {{ $t(value.original) }}
      </v-chip>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      />
    </v-sheet>
    <v-skeleton-loader
      :loading="loading"
      type="table"
      :types="{
        'table-row': 'table-cell@12',
        'table-tbody': 'table-row-divider@20',
      }"
    >
      <v-data-table
        :headers="headers"
        :items="mappedParts"
        :items-per-page="20"
        item-key="key"
        class="elevation-1"
        :search="search"
        sort-by="isNew"
        sort-desc="false"
      >
        <template v-slot:item.image="{ item }">
          <div class="p-2">
            <v-img
              :src="item.icon"
              :alt="item.machineName"
              height="30px"
              width="30px"
            ></v-img>
          </div>
        </template>
        <template v-slot:item.power="{ item }">
          <div class="p-2">
            <v-chip
              v-if="item.power"
              class="ma-2"
              :color="getPowerColor(item.power)"
              text-color="white"
            >
              {{ item.power }}
            </v-chip>
          </div>
        </template>
        <template v-slot:item.pierce="{ item }">
          <div class="p-2">
            <v-chip
              v-if="item.pierce"
              class="ma-2"
              :color="getPowerColor(item.pierce)"
              outlined
            >
              {{ item.pierce }}
            </v-chip>
          </div>
        </template>
        <template v-slot:item.machineName="{ item }">
          <div class="p-2">
            {{ $t(item.machineName) }}
            <v-chip
              label
              class="ma-2"
              x-small
              color="red"
              text-color="white"
              v-if="item.isNew"
            >
              NEW
            </v-chip>
          </div>
        </template>
        <template v-slot:item.wordTag1="{ item }">
          <div class="p-2">
            <v-chip label class="ma-2">
              <v-icon left>
                {{ getWordTagIcon(item.wordTag1) }}
              </v-icon>
              {{ $t(item.wordTag1) }}
            </v-chip>
          </div>
        </template>
        <template v-slot:item.passive2="{ item }">
          <div v-if="item.skillType" class="p-2">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-chip label outlined class="ma-2">
                  {{ $t(item.skillType) }}
                </v-chip>
              </template>
              <span>{{ item.skillDescription }}</span>
            </v-tooltip>
          </div>
          <div v-else>
            {{ item.passive2 }}
          </div>
        </template>
        <template v-slot:item.wordTag2="{ item }">
          <div class="p-2">
            <v-chip label class="ma-2">
              <v-icon left>
                {{ getWordTagIcon(item.wordTag2) }}
              </v-icon>
              {{ $t(item.wordTag2) }}
            </v-chip>
          </div>
        </template>
      </v-data-table>
    </v-skeleton-loader>
  </div>
</template>

<script>
import axios from "axios";
import POSITION from "@/constants/position";

export default {
  name: "ReviveDatabase",

  data: () => ({
    search: "",
    parts: [],
    partTypeMap: [],
    loading: true,
    showPositionPicker: false,
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
  },

  methods: {
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
        this.$router.push('/revive');
      } else {
        this.$router.push(link);
      }
    },
  },

  mounted() {
    window.legapp = this;
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
  },
};
</script>

<style lang="less" scoped>
.rainbow0 {
  //background: linear-gradient(to right, orange , yellow, green, cyan, blue, violet); /* Standard syntax (must be last) */
}

.rainbow {
  @rainbow-colors: red, orange, yellow, green, blue;
  background: linear-gradient(to left, @rainbow-colors) !important;
}
</style>
