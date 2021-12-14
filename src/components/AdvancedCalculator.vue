<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card color="primary" class="white--text">
          <v-container>
            <v-chip label> {{activeAttribute}}屬 All-Rounder LV 0 </v-chip>
            <h3 class="white--text">總加乘射攻EX威力</h3>
            <h1>{{ accumulatedRangeEX }}
              <v-chip outlined label>{{bestAmount.exBoost}}%EX加成</v-chip>
              <v-chip outlined label>{{bestAmount.rangeBoost}}%射攻加成</v-chip>
            </h1>
            <h2 v-if="bestCondition">
              <v-chip v-for="c in bestCondition.split(',')" :key="c">
                {{$t(c.split(':')[1])}}
              </v-chip>
            </h2>
            <v-divider class="white" />
            <h4 class="white--text darken-2">單強化(0.3)時射攻EX威力</h4>
            <h2>{{ singleBuffRangeEX }}</h2>
            <h4 class="white--text darken-2">雙強化(0.3/0.3)時射攻EX威力</h4>
            <h2>{{ doubleBuffRangeEX }}</h2>
          </v-container>
        </v-card>
        <v-divider />
        <v-card>
          <v-list dense>
            <v-list-item v-for="(item, key) in tableData" :key="key">
              <v-list-item-title>{{ key }}</v-list-item-title>
              <v-list-item-subtitle>{{ item }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
        <v-divider />
        <v-card>
          <v-container>
            Active Word Tags / Gear
            <div v-for="tag in activeWordTags" :key="tag">
              {{ $t(activeWordTags) }}
            </div>
          </v-container>
        </v-card>
      </v-col>
      <v-col>
        <v-card max-width="475" class="mx-auto">
          <v-list>
            <v-list-item
              three-line
              v-for="(value, key) in position"
              v-show="
                currentPosition ? currentPosition === value.original : true
              "
              :key="key"
              @click.stop="updatePosition(value.original)"
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
                    <div>
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
                        {{ data[value.original].main.name }}
                      </v-chip>
                    </div>
                    <div>
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
                    </div>
                  </template>
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ $t(data[value.original].activePassive1) }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  {{ $t(data[value.original].activePassive2) }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-chip
                  x-small
                  label
                  outlined
                  v-for="(tag, index) in data[value.original].wordTags"
                  :color="
                    data[value.original].activeWordTags.indexOf(tag) >= 0
                      ? 'primary'
                      : 'secondary'
                  "
                  @click.stop="data[value.original].addWordTag(tag)"
                  :key="index"
                >
                  {{ $t(tag) }}
                </v-chip>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
        <v-card
          max-width="475"
          class="mx-auto part-selector"
          max-height="500px"
          v-show="!!currentPosition"
          v-on-clickaway="away"
        >
            <v-text-field
              v-model="searchName"
              append-icon="mdi-magnify"
              label="Search name"
              single-line
              hide-details
            />
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
                  `${$t(value.machineName)} 格攻: ${value.melee} / 射攻: ${
                    value.range
                  }`
                }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ $t(value.passive1) }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  {{ $t(value.passive2) }}
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
import lzbase62 from 'lzbase62';
import { directive as onClickaway } from "vue-clickaway";
import POSITION from "@/constants/position";
import PartCombinator from "@/models/PartCombinator";
import TAG from "@/constants/tag.json";
import TAGGEAR from "@/constants/taggear.json";

function add(a, b) {
  return {
    rangeBoost: +a.rangeBoost + +b.rangeBoost || 0,
    meleeBoost: +a.rangeBoost + +b.rangeBoost || 0,
    exBoost: +a.exBoost + +b.exBoost || 0,
    effectBoost: +a.effectBoost + +b.effectBoost || 0,
  };
}

export default {
  name: "AdvancedCalculator",
  directives: {
    onClickaway,
  },
  data: () => ({
    search: "",
    parts: [],
    partTypeMap: [],
    loading: true,
    currentPosition: "",
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
    TAG,
    TAGGEAR,
    searchName: '',
  }),

  computed: {
    urldata() {
      const rows = Object.values(this.data).map((p) => {
        return [
          [p.main.id, p.main.level],
          [p.sub.id, p.sub.level],
          p.activeSubposition,
        ];
      });
      const data = {
        version: 1,
        job: '',
        data: rows,
      };
      return lzbase62.compress(JSON.stringify(data));
    },
    $dp() {
      const a = Object.entries(this.activatedConditions);
      const r = {};
      a.forEach(([c, amount]) => {
        const [conditionType, condition] = c.split(":");
        if (!r[conditionType]) {
          r[conditionType] = [];
        }
        r[conditionType].push({
          condition,
          amount,
        });
      });
      return r;
    },
    flattenMap() {
      const map = [];
      this.gg(map, [], Object.entries(this.$dp));
      return map;
    },
    bestAmount() {
      return this.$bestAmount[1];
    },
    bestCondition() {
      return this.$bestAmount[0];
    },
    $bestAmount() {
      if (!Object.entries(this.activatedConditions).length) {
        return ['', {
          exBoost: 0,
          rangeBoost: 0,
          meleeBoost: 0,
          effectBoost: 0,
        }];
      }
      const map = {};
      this.flattenMap.forEach((list) => {
        const key = list.join(',');
        let result = {
          exBoost: 0,
          rangeBoost: 0,
          meleeBoost: 0,
          effectBoost: 0,
        };
        Object.entries(this.activatedConditions).forEach(([k, v]) => {
          if (this.checkCondition(k, list)) {
            result = add(result, v);
          }
        });
        map[key] = result;
      });
      return Object.entries(map).sort((a, b) => {
        if (a[1] > b[1]) {
          return 1;
        }
        if (a[1] === b[1]) {
          return 0;
        }
        if (a[1] < b[1]) {
          return 1;
        }
      })[0];
    },
    activatedConditions() {
      const conditionMap = {};
      Object.values(this.data).forEach((part) => {
        if (part.isEmpty) {
          return;
        }
        part.activePart.passives.forEach((passive) => {
          if (!passive.$conditionType) {
            return;
          }
          if (
            !conditionMap[`${passive.$conditionType}:${passive.$condition}`]
          ) {
            conditionMap[`${passive.$conditionType}:${passive.$condition}`] = {
              rangeBoost: 0,
              meleeBoost: 0,
              exBoost: 0,
              effectBoost: 0,
            };
          }
          console.log(passive.table);
          if (!passive.table || !passive.table.length) {
            return;
          }
          const target = {};
          target[passive.boostKey] = +passive.table[part.activePart.level][1];
          conditionMap[`${passive.$conditionType}:${passive.$condition}`] = add(
            conditionMap[`${passive.$conditionType}:${passive.$condition}`],
            target
          );
        });
      });
      return conditionMap;
    },
    accumulatedRangeEX() {
      return Math.round((1 + (this.bestAmount.rangeBoost + this.bestAmount.exBoost) / 100) * this.calculatedRangeAttack);
    },
    accumulatedMeleeEX() {
      return Math.round((1 + (this.bestAmount.meleeBoost + this.bestAmount.exBoost) / 100) * this.calculatedMeleeAttack);
    },
    singleBuffRangeEX() {
      return Math.round(
        1.3 * (1 + this.bestAmount.effectBoost / 100) * this.accumulatedRangeEX,
      );
    },
    doubleBuffRangeEX() {
      return Math.round(
        2 * 1.3 * (1 + this.bestAmount.effectBoost / 100) * this.accumulatedRangeEX,
      );
    },
    singleBuffMeleeEX() {
      return Math.round(
        1.3 * (1 + this.bestAmount.effectBoost / 100) * this.accumulatedMeleeEX,
      );
    },
    doubleBuffMeleeEX() {
      return Math.round(
        2 * 1.3 * (1 + this.bestAmount.effectBoost / 100) * this.accumulatedMeleeEX,
      );
    },
    calculatedMeleeAttack() {
      return (
        (1 + this.activeWordTagsEffect.meleeAttack / 100) *
        Object.values(this.data).reduce((a, b) => a + b.meleeAttack, 0)
      );
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
    calculatedBoostAmount() {
      return Object.values(this.data).reduce((a, b) => a + b.boostAmount, 0);
    },
    calculatedBuffBoostAmount() {
      return Object.values(this.data).reduce(
        (a, b) => a + b.buffBoostAmount,
        0
      );
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
    activeAttribute() {
      const properties = {};
      Object.values(this.data).forEach((p) => {
        const t = p.main.attribute;
        if (!properties[t]) {
          properties[t] = 0;
        }
        properties[t] += 1;
      });
      let r = Object.entries(properties)
        .filter(([, value]) => value >= 5);
      if (r.length) {
        return r[0][0];
      } else {
        return '無';
      }
    },
    activeWordTags() {
      const tags = {};
      Object.values(this.data).forEach((p) => {
        p.activeWordTags.forEach((t) => {
          if (!tags[t]) {
            tags[t] = 0;
          }
          tags[t] += 1;
        });
      });
      return Object.entries(tags)
        .filter(([, value]) => value >= 5)
        .map(([key]) => key);
    },
    activeWordTagsEffect() {
      return this.activeWordTags.reduce(
        (a, b) => {
          return {
            armor: a.armor + this.TAG[b].armor,
            meleeAttack: a.meleeAttack + this.TAG[b].meleeAttack,
            rangeAttack: a.rangeAttack + this.TAG[b].rangeAttack,
            meleeDefense: a.meleeDefense + this.TAG[b].meleeDefense,
            rangeDefense: a.rangeDefense + this.TAG[b].rangeDefense,
            beamResistence: a.beamResistence + this.TAG[b].beamResistence,
            physicalResistence:
              a.physicalResistence + this.TAG[b].physicalResistence,
          };
        },
        {
          armor: 0,
          meleeAttack: 0,
          rangeAttack: 0,
          meleeDefense: 0,
          rangeDefense: 0,
          beamResistence: 0,
          physicalResistence: 0,
        }
      );
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
        boost: Math.round(this.calculatedBoostAmount),
      };
    },
    mappedParts() {
      const a = this.parts.map((part) => ({
        ...part,
        machineName: this.$t(part.machineName) || this.$t(part.aiName),
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
        if (!this.searchName || part.machineName.indexOf(this.searchName) >= 0) {
          map[part.position].push(Object.freeze(part));
        }
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
    checkCondition(conditionString, conditions) {
      const [type, condition] = conditionString.split(':');
      switch (type) {
        case 'tag':
          if (this.activeWordTags.indexOf(condition) >= 0) {
            return true;
          }
          break;
        case 'attribute':
          if (this.activeAttribute === condition) {
            return true;
          }
          break;
        case 'category':
        case 'environment':
        case 'team':
        case 'job':
        case 'type':
          if (conditions.indexOf(conditionString) >= 0) {
            return true;
          }
          break;
        default:
          return true;
      }
    },
    gg(final = [], condition = [], current = []) {
      if (current.length === 0) {
        final.push(condition);
        return;
      }
      const copy = current.slice(0);
      const [conditionType, conditionList] = copy.shift();
      switch (conditionType) {
        case 'category':
        case 'environment':
        case 'team':
        case 'job':
        case 'type':
          conditionList.forEach(($condition) => {
            const conditionCopy = condition.slice(0);
            conditionCopy.push(`${conditionType}:${$condition.condition}`);
            this.gg(final, conditionCopy, copy);
          });
          break;
        case 'attribute':
        case 'tag':
        default:
          this.gg(final, condition, copy);
          break;
      }
    },
    selectPart(part) {
      this.data[this.currentPosition].insert(part);
      this.currentPosition = "";
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
    away() {
      this.currentPosition = "";
      this.searchName = '';
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
    compress(obj) {
      return lzbase62.compress(JSON.stringify(obj));
    },
    decompress(str) {
      return JSON.parse(lzbase62.decompress(str));
    }
  },

  mounted() {
    window.app4 = this;
    window.lzbase62 = lzbase62;
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
