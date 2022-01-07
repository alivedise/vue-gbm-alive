<template>
  <v-sheet class="picker">
    <v-toolbar
      dark
      color="secondary"
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
    <v-sheet class="pa-3">
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
            <v-chip-group
              v-model="labelFilter"
              column
              multiple
            >
              <v-chip
                filter
                outlined
              >
                雙重威力提升
              </v-chip>
              <v-chip
                filter
                outlined
                v-show="doubleBoost"
              >
                特定部件威力提升
              </v-chip>
              <v-chip
                filter
                outlined
              >
                初始充能
              </v-chip>
              <v-chip
                filter
                outlined
              >
                冷卻時間
              </v-chip>
              <v-chip
                filter
                outlined
                v-show="cooldownReduction"
              >
                僅限1次-冷卻
              </v-chip>
            </v-chip-group>
          </v-col>
          <v-col cols="2">
            <v-select
              :items="Object.values(tagMapByText)"
              v-model="tagFilter"
              dense
              solo
            >
              <template slot="label">
                詞彙
              </template>
              <template v-slot:selection="{ item }">
                <span class="d-flex justify-center" style="width: 100%;">
                  {{ $t(item.text) }}
                </span>
              </template>
              <template v-slot:item="{ item }">
                <span class="d-flex justify-center" style="width: 100%;">
                  {{ $t(item.text) }}
                </span>
              </template>
            </v-select>

            <v-chip v-if="tagFilter">
              <v-icon @click="resetTagFilter">mdi-close</v-icon>
              {{$t(tagFilter)}}
            </v-chip>
          </v-col>
          <v-col cols="2" v-if="weaponTypeList.length">
            <v-select
              :items="weaponTypeList"
              v-model="weaponType"
              dense
              solo
              :disabled="weaponCategory !== ''"
            >
              <template slot="label">
                武器類型
              </template>
              <template v-slot:selection="{ item }">
                <span class="d-flex justify-center" style="width: 100%;">
                  {{ $t(item) }}
                </span>
              </template>
              <template v-slot:item="{ item }">
                <span class="d-flex justify-center" style="width: 100%;">
                  {{ $t(item) }}
                </span>
              </template>
            </v-select>

            <v-chip v-if="weaponType && !weaponCategory">
              <v-icon @click="resetWeaponType">mdi-close</v-icon>
              {{$t(weaponType)}}
            </v-chip>
          </v-col>
          <v-col cols="2">
            <v-btn-toggle>
              <v-btn v-model.lazy="altered">
                只顯示改造
              </v-btn>
              <v-btn v-model.lazy="hideIntegrated">
                不顯示整合件
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
    </v-sheet>
    <v-data-table
      v-if="!gridMode"
      :headers="headers"
      :items="mappedParts[category]"
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
          <AppCacheImage
            :src="item.icon"
            :alt="item.machineName"
            height="30px"
            width="30px"
          />
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
              {{ getTagIcon(item.wordTag1) }}
            </v-icon>
            {{ $t(item.wordTag1) }}
          </v-chip>
        </div>
      </template>
      <template v-slot:item.passive1="{ item }">
        {{ $t(item.passive1 || item.skillName) }}
      </template>
      <template v-slot:item.passive2="{ item }">
        <div v-if="item.skillType" class="p-2">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-chip label outlined class="ma-2">
                {{ $t(item.skillType) }}
              </v-chip>
            </template>
            <span>{{ $t(item.skillDescription) }}</span>
          </v-tooltip>
        </div>
        <div v-else>
          {{ $t(item.passive2) }}
        </div>
      </template>
      <template v-slot:item.wordTag2="{ item }">
        <div class="p-2">
          <v-chip label class="ma-2">
            <v-icon left>
              {{ getTagIcon(item.wordTag2) }}
            </v-icon>
            {{ $t(item.wordTag2) }}
          </v-chip>
        </div>
      </template>
    </v-data-table>
    <v-container v-else>
      <v-row>
        <v-col
          cols="12"
          sm="4"
          v-for="(part, i) in currentPartList"
          :key="i"
        >
          <v-list-item
            three-line
            @click.stop="selectPart(part)"
          >
            <v-list-item-icon class="d-flex flex-column ">
              <AppCacheImage
                height="50px"
                width="50px"
                position="top center"
                :src="part.icon"
              />
              <h5><v-img src="@/assets/i_04.svg" width="15" class="d-inline-flex" />{{part.range}}</h5>
              <h5><v-img src="@/assets/i_03.svg" width="15" class="d-inline-flex" />{{part.melee}}</h5>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                <v-btn
                  small
                  tile
                  width="100%"
                  color="secondary"
                >
                  {{ $t(part.machineName || part.aiName) }}
                </v-btn>
              </v-list-item-title>
              <v-list-item-subtitle
                :class="{
                  'overflow-x-hidden': true,
                }"
              >
                {{ $t(part.passive1) || '-' }}
              </v-list-item-subtitle>
              <v-list-item-subtitle
                :class="{
                  'overflow-x-hidden': true,
                }"
              >
                {{ $t(part.passive2) || '-' }}
              </v-list-item-subtitle>
              <v-list-item-subtitle @click.stop.prevent>
                <v-chip
                  label
                  x-small
                  class="mr-2"
                  outlined
                  @click.stop.prevent="tagFilter=part.wordTag1"
                >
                  {{ $t(part.wordTag1) }}
                </v-chip>
                <v-chip
                  label
                  x-small
                  outlined
                  @click.stop.prevent="tagFilter=part.wordTag2"
                >
                  {{ $t(part.wordTag2) }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
      </v-row>
      <div class="text-center">
        <v-pagination
          v-model="currentPage"
          :length="totalPage"
          :total-visible="5"
          prev-icon="mdi-menu-left"
          next-icon="mdi-menu-right"
        ></v-pagination>
      </div>
    </v-container>
  </v-sheet>
</template>

<script>
import AppCacheImage from '@/components/AppCacheImage.vue';

export default {
  name: 'CalculatorPartPicker',
  components: {
    AppCacheImage,
  },
  props: {
    parts: {
      type: Array,
    },
    machines: {
      type: Object,
    },
    category: {
      type: String,
    },
    weaponCategory: {
      type: String,
    },
    tagMapByText: {
      type: Object,
    },
    getTagIcon: {
      type: Function,
    },
    pickingSub: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tagFilter: '',
      search: '',
      labelFilter: [],
      currentPage: 1,
      ITEM_COUNT_PER_PAGE: 24,
      sortBy: 'range',
      altered: true,
      hideIntegrated: true,
      gridMode: false,
      weaponType: '',
      headers: [
        { text: "部位", value: "position", sortable: false },
        { text: "圖示", value: "image", sortable: false },
        { text: "名稱", value: "machineName" },
        { text: "耐力", value: "stamina" },
        { text: "轉換格攻", value: "accumluatedMeleeAttack" },
        { text: "轉換射攻", value: "accumluatedRangeAttack" },
        { text: "詞彙1", value: "wordTag1" },
        { text: "詞彙2", value: "wordTag2" },
        { text: "特性1/技能", value: "passive1" },
        { text: "特性2/說明", value: "passive2" },
      ],
    };
  },
  methods: {
    closeTable() {
      this.search = '';
      this.tagFilter = '';
      this.currentPage = 1;
      this.labelFilter = [];
      this.sortBy = 'range';
      this.altered = true;
      this.$emit('close');
    },
    selectPart(part) {
      this.$emit('select', part);
      this.closeTable();
    },
    resetTagFilter() {
      this.tagFilter = '';
    },
    resetWeaponType() {
      this.weaponType = '';
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
  },
  watch: {
    weaponCategory(v) {
      this.weaponType = v || '';
    },
    tagFilter() {
      this.currentPage = 1;
    },
    altered() {
      this.currentPage = 1;
    },
    labelFilter() {
      this.currentPage = 1;
    },
    search() {
      this.currentPage = 1;
    },
    category(v) {
      if (v === 'パイロット') {
        this.altered = false;
      }
    },
    pickingSub(v) {
      if (!v) {
        this.hideIntegrated = true;
      } else {
        this.hideIntegrated = false;
      }
    },
  },
  computed: {
    weaponTypeList() {
      if (this.weaponCategory) {
        return [this.weaponCategory];
      }
      const map = {};
      (this.mappedParts[this.category] || []).forEach((p) => {
        if (p.weaponType && !map[p.weaponType]) {
          map[p.weaponType] = true;
        }
      });
      return Object.keys(map);
    },
    sortedList() {
      return (this.mappedParts[this.category] || []).sort((a, b) => {
        if (a[this.sortBy] > b[this.sortBy]) {
          return 1;
        }
        if (a[this.sortBy] < b[this.sortBy]) {
          return -1;
        }
        return 0;
      })
    },
    currentPartList() {
      return this.sortedList.slice((this.currentPage - 1) * this.ITEM_COUNT_PER_PAGE, this.currentPage * this.ITEM_COUNT_PER_PAGE - 1 + this.ITEM_COUNT_PER_PAGE);
    },
    totalPage() {
      return Math.ceil((this.sortedList || []).length / this.ITEM_COUNT_PER_PAGE);
    },
    doubleBoost() {
      return this.labelFilter.indexOf(0) >= 0;
    },
    specificBoost() {
      return this.labelFilter.indexOf(1) >= 0;
    },
    initialCharge() {
      return this.labelFilter.indexOf(2) >= 0;
    },
    cooldownReduction() {
      return this.labelFilter.indexOf(3) >= 0;
    },
    oneTimeCooldownReduction() {
      return this.labelFilter.indexOf(4) >= 0;
    },
    mappedParts() {
      let a = this.parts.map((part) => (Object.freeze({
        ...part,
        machineName: this.$t(part.machineName || part.aiName),
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
      })));
      if (this.doubleBoost) {
        if (this.specificBoost) {
          a = a.filter((i) => i.specificBoost);
        } else {
          a = a.filter((i) => i.doubleBoost);
        }
      }
      if (this.initialCharge) {
        a = a.filter((i) => i.initialCharge);
      }
      if (this.cooldownReduction) {
        if (this.oneTimeCooldownReduction) {
          a = a.filter((i) => i.oneTimeCooldownReduction);
        } else {
          a = a.filter((i) => i.cooldownReduction && !i.oneTimeCooldownReduction);
        }
      }
      if (this.tagFilter) {
        a = a.filter((i) => i.wordTag1 === this.tagFilter || i.wordTag2 === this.tagFilter);
      }
      const map = {};
      a.forEach((part) => {
        if (!map[part.position]) {
          map[part.position] = [];
        }
        const matchType = this.weaponCategory || this.weaponType;
        if (part.weaponType && matchType) {
          if (part.weaponType !== matchType) {
            return;
          }
        }

        if (this.altered) {
          if (!part.isAltered) {
            return;
          }
        }

        if (this.hideIntegrated) {
          if (part.integrated) {
            return;
          }
        }

        map[part.position].push(part);
      });
      return map;
    },
  },
};
</script>

<style>
.picker {
  height: 100%;
}
</style>
