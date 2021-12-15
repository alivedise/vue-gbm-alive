<template>
  <v-container>
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="primary"
        >
          <v-btn
            icon
            dark
            @click="closeTable"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Click a part to choose it</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-container>
          <v-row>
            <v-col
              cols="12"
              sm="6"
              md="3"
            >
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search name"
                single-line
                hide-details
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
              md="3"
            >
              <v-btn
                :color="onlyShowAltered ? 'indigo' : ''"
                :outlined="!onlyShowAltered"
                :text-color="onlyShowAltered ? 'white' : ''"
                @click="onlyShowAltered = !onlyShowAltered"
              >
                忽略未改造
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
        <v-data-table
          :headers="headers"
          :items="mappedParts[currentPosition]"
          :items-per-page="20"
          item-key="key"
          class="elevation-1"
          :search="search"
          :sort-by="'addTime'"
          :sort-desc="true"
          @click:row="selectPart"
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
          <template v-slot:item.position="{ item }">
            <div class="p-2">
              {{$t(item.position) + (item.integrated ? ` ${item.integrated}` : '')}}
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
                v-if="item.isNew && item.addDate === '2021/12/8'"
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
      </v-card>
    </v-dialog>
    <v-row>
      <v-col>
        <v-expansion-panels
          v-model="panel"
          :disabled="disabled"
          multiple
        >
          <v-expansion-panel>
            <v-expansion-panel-header>
              總加乘射攻EX威力面板
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-container>
                <v-btn tile outlined width="25%">
                  {{(activeAttribute ? activeAttribute[0] : '') || '無'}}屬
                </v-btn>
                <v-btn tile width="50%">
                  All-Rounder
                </v-btn>
                <v-btn tile outlined width="25%">
                  LV.{{jobGear.level}}
                </v-btn>
                <h1>
                  {{ accumulatedRangeEX }}
                </h1>
                <v-theme-provider
                  light
                  v-if="bestCondition"
                >
                  <v-alert
                    border="left"
                    colored-border
                    color="orange"
                    dense
                  >
                    <span small v-for="c in bestCondition.split(',')" :key="c">
                      {{$t(c.split(':')[1])}}
                    </span>
                  </v-alert>
                </v-theme-provider>
                </h1>
                <v-divider />
                <br/>
                <template v-if="linearMode">
                  <v-progress-linear
                    v-model="bestAmount.exBoost"
                    color="teal"
                    height="15"
                  >
                    <template v-slot:default="{ value }">
                      <strong>{{ Math.ceil(value) }}% EX加成</strong>
                    </template>
                  </v-progress-linear>
                  <v-progress-linear
                    v-model="bestAmount.rangeBoost"
                    color="primary"
                    height="15"
                  >
                    <template v-slot:default="{ value }">
                      <strong>{{ Math.ceil(value) }}% EX加成</strong>
                    </template>
                  </v-progress-linear>
                  <v-progress-linear
                    v-model="bestAmount.initialCharge"
                    color="red"
                    height="15"
                  >
                    <template v-slot:default="{ value }">
                      <strong>{{ Math.ceil(value) }}% 初始充能</strong>
                    </template>
                  </v-progress-linear>
                  <v-progress-linear
                    v-model="bestAmount.cooldownReduction"
                    color="blue-grey"
                    height="15"
                  >
                    <template v-slot:default="{ value }">
                      <strong>{{ Math.ceil(value) }}% 冷卻</strong>
                    </template>
                  </v-progress-linear>
                </template>
                <template v-else>
                  <v-badge
                    color="teal"
                    :content="'EX加成'"
                    :offset-x="35"
                  >
                    <v-progress-circular
                      :indeterminate="shouldDisplayBoostLoading"
                      :rotate="90"
                      :size="70"
                      :width="12"
                      :value="bestAmount.exBoost"
                      color="teal"
                    >
                      {{ bestAmount.exBoost || 0 }}%
                    </v-progress-circular>
                  </v-badge>
                  <v-badge
                    color="primary"
                    :content="'射攻加成'"
                    :offset-x="35"
                  >
                    <v-progress-circular
                      :indeterminate="shouldDisplayBoostLoading"
                      :rotate="360"
                      :size="70"
                      :width="12"
                      :value="bestAmount.rangeBoost"
                      color="primary"
                    >
                      {{ bestAmount.rangeBoost || 0 }}%
                    </v-progress-circular>
                  </v-badge>
                  <v-badge
                    color="green"
                    :content="'初始充能'"
                    :offset-x="35"
                  >
                    <v-progress-circular
                      :indeterminate="shouldDisplayBoostLoading"
                      :rotate="180"
                      :size="70"
                      :width="12"
                      :value="bestAmount.initialCharge || 0"
                      color="green"
                    >
                      {{ bestAmount.initialCharge || 0}}%
                    </v-progress-circular>
                  </v-badge>
                  <v-badge
                    color="purple"
                    :content="'減冷卻'"
                    :offset-x="35"
                  >
                    <v-progress-circular
                      :indeterminate="shouldDisplayBoostLoading"
                      :rotate="270"
                      :size="70"
                      :width="12"
                      :value="bestAmount.cooldownReduction"
                      color="purple"
                    >
                      {{ bestAmount.cooldownReduction || 0 }}%
                    </v-progress-circular>
                  </v-badge>
                </template>
                <v-divider />
                <v-container>
                  <v-row>
                    <v-col>
                      <h2>
                        <v-badge color="secondary" :content="1">
                          <v-img src="@/assets/i_04.svg" width="20" class="d-inline-flex" />
                          <v-icon>mdi-arrow-up</v-icon>
                        </v-badge>
                        {{ singleBuffRangeEX }}
                      </h2>
                    </v-col>
                    <v-col>
                      <h2>
                        <v-badge color="secondary" :content="2">
                          <v-img src="@/assets/i_04.svg" width="10" class="d-inline-flex" />
                          <v-img src="@/assets/i_03.svg" width="10" class="d-inline-flex" />
                          <v-icon>mdi-arrow-up</v-icon>
                          <v-icon>mdi-arrow-up</v-icon>
                        </v-badge>
                        {{ doubleBuffRangeEX }}
                      </h2>
                    </v-col>
                  </v-row>
                </v-container>
              </v-container>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header>原始參數列表</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-list dense>
                <v-list-item v-for="(item, key) in tableData" :key="key">
                  <v-list-item-title>{{ key }}</v-list-item-title>
                  <v-list-item-subtitle>{{ item }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header>詞彙及齒輪 / 轉換齒輪</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-container v-if="activeWordTags.length">
                <v-row v-for="tag in activeWordTags" :key="tag">
                  <v-btn tile width="50%">
                    {{ $t(tag) }}
                  </v-btn>
                  <v-btn tile outlined width="50%">
                    LV.4
                  </v-btn>
                </v-row>
              </v-container>
              <v-container>
                <v-row>
                  <v-btn tile width="50%">
                    射擊轉換
                  </v-btn>
                  <v-btn tile outlined width="50%">
                    LV.4
                  </v-btn>
                </v-row>
              </v-container>
              <v-container>
                <v-row>
                  <v-btn tile width="50%">
                    射擊攻擊
                  </v-btn>
                  <v-btn tile outlined width="50%">
                    LV.5
                  </v-btn>
                </v-row>
              </v-container>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
      <v-col>
        <v-card max-width="475" class="mx-auto">
          <v-progress-linear
            v-if="loading"
            indeterminate
            color="cyan"
          ></v-progress-linear>
          <v-list>
            <v-list-item
              three-line
              v-for="(value, key) in position"
              :key="key"
              @click.stop="updatePosition(value.original)"
            >
              <v-list-item-icon>
                <v-img
                  height="30px"
                  width="30px"
                  :src="
                    data[value.original].isEmpty
                      ? value.icon
                      : data[value.original].main.icon
                  "
                />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  <template v-if="data[value.original].isEmpty">
                    {{ $t(value.original) }}
                  </template>
                  <template v-else>
                    <div>
                      <v-btn
                        small
                        tile
                        width="50%"
                        :color="
                          data[value.original].activeSubposition === 0
                            ? 'primary'
                            : 'secondary'
                        "
                        @click.stop="data[value.original].toggleActivation()"
                      >
                        {{ data[value.original].main.name }}
                      </v-btn>
                      <v-btn
                        small
                        tile
                        width="50%"
                        v-if="!data[value.original].sub.isEmpty"
                        :color="
                          data[value.original].activeSubposition === 1
                            ? 'primary'
                            : 'secondary'
                        "
                        @click.stop="data[value.original].toggleActivation()"
                      >
                        {{ data[value.original].sub.name }}
                      </v-btn>
                    </div>
                  </template>
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ $t(data[value.original].activePassive1) }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  {{ $t(data[value.original].activePassive2) || 'NONE' }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action width="80px">
                <v-badge
                  v-for="(tag, index) in data[value.original].wordTags"
                  :key="index"
                  :content=" activeWordTagMap[tag] "
                  inline
                >
                  <v-icon
                    x-small
                    label
                    outlined
                    :color="
                      data[value.original].activeWordTags.indexOf(tag) >= 0
                        ? 'primary'
                        : 'secondary'
                    "
                    @click.stop="data[value.original].addWordTag(tag)"
                  >
                    {{ getTagIcon(tag) }}
                  </v-icon>
                </v-badge>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import lzbase62 from "lzbase62";
import { directive as onClickaway } from "vue-clickaway";
import POSITION from "@/constants/position";
import PartCombinator from "@/models/PartCombinator";
import TAG from "@/constants/tag.json";
import TAGGEAR from "@/constants/taggear.json";
import TAG_DATA from "@/constants/TAG_DATA.json";

function add(a, b) {
  return {
    rangeBoost: +a.rangeBoost + +b.rangeBoost || 0,
    meleeBoost: +a.rangeBoost + +b.rangeBoost || 0,
    exBoost: +a.exBoost + +b.exBoost || 0,
    effectBoost: +a.effectBoost + +b.effectBoost || 0,
  };
}
const convertArrayToObject = (array, key) => {
  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key]]: item,
    };
  }, initialValue);
};

export default {
  name: "AdvancedCalculator",
  directives: {
    onClickaway,
  },
  data: () => ({
    dialog: false,
    panel: [0, 2],
    onlyShowAltered: true,
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
    jobGear: {
      job: '',
      level: 0,
    },
    wordTagGear: {
      tag: '',
      level: 1,
    },
  }),

  computed: {
    shouldDisplayBoostLoading() {
      return this.loading && this.$route.params.data !== '';
    },
    urldata() {
      const rows = Object.values(this.data).map((p) => {
        return [
          [p.main.id, p.main.level],
          [p.sub.id, p.sub.level],
          p.activeSubposition,
          ...p.activeWordTags.map((t) => this.getTagID(t) || ""),
        ];
      });
      const data = {
        version: 1,
        job: "",
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
        return [
          "",
          {
            exBoost: 0,
            rangeBoost: 0,
            meleeBoost: 0,
            effectBoost: 0,
          },
        ];
      }
      const map = {};
      this.flattenMap.forEach((list) => {
        const key = list.join(",");
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
      return Math.round(
        (1 + (this.bestAmount.rangeBoost + this.bestAmount.exBoost) / 100) *
          this.calculatedRangeAttack
      );
    },
    accumulatedMeleeEX() {
      return Math.round(
        (1 + (this.bestAmount.meleeBoost + this.bestAmount.exBoost) / 100) *
          this.calculatedMeleeAttack
      );
    },
    singleBuffRangeEX() {
      return Math.round(
        1.3 * (1 + this.bestAmount.effectBoost / 100) * this.accumulatedRangeEX
      );
    },
    doubleBuffRangeEX() {
      return Math.round(
        2 *
          1.3 *
          (1 + this.bestAmount.effectBoost / 100) *
          this.accumulatedRangeEX
      );
    },
    singleBuffMeleeEX() {
      return Math.round(
        1.3 * (1 + this.bestAmount.effectBoost / 100) * this.accumulatedMeleeEX
      );
    },
    doubleBuffMeleeEX() {
      return Math.round(
        2 *
          1.3 *
          (1 + this.bestAmount.effectBoost / 100) *
          this.accumulatedMeleeEX
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
      let r = Object.entries(properties).filter(([, value]) => value >= 5);
      if (r.length) {
        return r[0][0];
      } else {
        return "無";
      }
    },
    activeWordTags() {
      return Object.entries(this.activeWordTagMap)
        .filter(([, value]) => value >= 5)
        .map(([key]) => key);
    },
    activeWordTagMap() {
      const tags = {};
      Object.values(this.data).forEach((p) => {
        p.activeWordTags.forEach((t) => {
          if (!tags[t]) {
            tags[t] = 0;
          }
          tags[t] += 1;
        });
      });
      return tags;
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
    partById() {
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
      return convertArrayToObject(a, "id");
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
        map[part.position].push(part);
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
    closeTable() {
      this.dialog = false;
      this.currentPosition = "";
      this.search = "";
    },
    getTagIcon(text) {
      return Object.values(TAG_DATA).find((data) => data.text === text).icon;
    },
    getTagID(text) {
      return Object.values(TAG_DATA).find((data) => data.text === text).id;
    },
    updateUrl() {
      this.$router.replace({
        name: "AdvacnedCalculatorData",
        params: { data: this.urldata },
      });
    },
    loadDataFromURL() {
      let { data } = this.$route.params;
      data = JSON.parse(lzbase62.decompress(data));
      console.log(data);
      data.data.forEach(([main, sub, active, tag1, tag2], index) => {
        const mainPart = this.partById[+main[0]];
        const subPart = this.partById[+sub[0]];
        console.log(mainPart, subPart);
        const pc = Object.values(this.data)[index];
        if (mainPart) {
          pc.insert(mainPart);
        }
        if (subPart) {
          pc.insert(subPart);
        }
        pc.activeSubposition = +active;
        if (tag1 !== "") {
          pc.addWordTag(TAG_DATA[tag1].text);
        }
        if (tag2 !== "") {
          pc.addWordTag(TAG_DATA[tag2].text);
        }
      });
    },
    checkCondition(conditionString, conditions) {
      const [type, condition] = conditionString.split(":");
      switch (type) {
        case "tag":
          if (this.activeWordTags.indexOf(condition) >= 0) {
            return true;
          }
          break;
        case "attribute":
          if (this.activeAttribute === condition) {
            return true;
          }
          break;
        case "category":
        case "environment":
        case "team":
        case "job":
        case "type":
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
        case "category":
        case "environment":
        case "team":
        case "job":
        case "type":
          conditionList.forEach(($condition) => {
            const conditionCopy = condition.slice(0);
            conditionCopy.push(`${conditionType}:${$condition.condition}`);
            this.gg(final, conditionCopy, copy);
          });
          break;
        case "attribute":
        case "tag":
        default:
          this.gg(final, condition, copy);
          break;
      }
    },
    selectPart(part) {
      this.data[this.currentPosition].insert(part);
      this.closeTable();
      this.updateUrl();
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
      this.dialog = true;
    },
    away() {
      this.currentPosition = "";
      this.searchName = "";
    },
    getWordTagIcon() {
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
      return table;
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
    },
  },

  mounted() {
    this.$vuetify.theme.dark = true;
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
        this.loadDataFromURL();
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
