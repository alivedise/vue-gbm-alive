<template>
  <v-container>
    <v-alert
      dense
      text
      type="success"
      v-show="displayLoadLocalData"
    >
      是否回復上次機體資料？
      <v-btn @click="loadLocalData">
        是
      </v-btn>
      <v-btn @click="displayLoadLocalData = false;">
        否
      </v-btn>
    </v-alert>
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <CalculatorPartPicker
        :tagMapByText="tagMapByText"
        :machines="machines"
        :parts="parts"
        :category="currentPosition"
        :weaponCategory="currentWeaponCategory"
        @select="selectPart"
        @close="closeTable"
        :pickingSub="pickingSub"
        :getTagIcon="getTagIcon"
      />
    </v-dialog>
    <v-row id="my-build">
      <v-col>
        <v-expansion-panels
          v-model="panel"
          multiple
        >
          <v-expansion-panel>
            <v-expansion-panel-header>
              特性總加乘EX威力
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-container>
                <v-row align="center">
                  <v-col cols="3">
                    <v-badge
                      :content="attributeMapString"
                      bottom
                      inline
                      tile
                      class="d-flex justify-center" style="width: 100%;"
                    >
                      {{(activeAttribute ? activeAttribute[0] : '') || '無'}}
                    </v-badge>
                  </v-col>
                  <v-col cols="6">
                    <v-select
                      :items="jobList"
                      v-model="jobGear.job"
                      @change="updateUrl"
                      dense
                      :disabled="shouldDisableJobSelector"
                      solo
                    >
                      <template v-slot:selection="{ item }">
                        <span class="d-flex justify-center" style="width: 100%;">
                          {{ item }}
                        </span>
                      </template>
                    </v-select>
                  </v-col>
                  <v-col cols="2">
                    <v-select
                      :items="getGearLevelList(4)"
                      v-model="jobGear.level"
                      @change="updateUrl"
                      :disabled="shouldDisableJobLevelSelector"
                      dense
                      solo
                    >
                      <template v-slot:selection="{ item }">
                        <span class="d-flex justify-center" style="width: 100%;">
                          {{ item.label }}
                        </span>
                      </template>
                    </v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-badge :class="rangeValueOrder" inline color="silver" :content="`=${Math.ceil(calculatedRangeAttack)}*(1*(${getSimplifiedSkillAmount().exBoost}%+${getSimplifiedSkillAmount().rangeBoost}%))`">
                    <h1>
                      <v-chip outlined color="red" label small>射EX</v-chip>
                      {{ accumulatedRangeEX }}
                    </h1>
                  </v-badge>
                  <v-badge :class="meleeValueOrder" inline color="silver" :content="`=${Math.ceil(calculatedMeleeAttack)}*(1*(${getSimplifiedSkillAmount().exBoost}%+${getSimplifiedSkillAmount().meleeBoost}%))`">
                    <h1>
                      <v-chip outlined color="red" label small>格EX</v-chip>
                      {{ accumulatedMeleeEX }}
                    </h1>
                  </v-badge>
                </v-row>
                <v-row>
                  <v-col cols="12">
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
                        <v-container>
                          <v-row align="center">
                            <v-btn-toggle class="mr-1"  dense v-model="conditionMap.category" @change="updateUrl" v-if="currentWeaponCategoryConditionList.length">
                              <v-btn v-for="category in currentWeaponCategoryConditionList" :key="category" :value="category">
                                {{$t(category)}}
                              </v-btn>
                            </v-btn-toggle>
                            <v-btn-toggle class="mr-1" dense v-model="conditionMap.type" @change="updateUrl">
                              <v-btn v-for="type in currentAttackTypeList" :key="type" :value="type">
                                {{$t(type)}}
                              </v-btn>
                            </v-btn-toggle>
                            <v-btn-toggle class="mr-1"  dense v-model="conditionMap.team" @change="updateUrl" v-if="currentTeamList.length" >
                              <v-btn v-for="team in currentTeamList" :key="team" :value="team">
                                {{$t(team)}}
                              </v-btn>
                            </v-btn-toggle>
                            <v-btn-toggle class="mr-1"  dense v-model="conditionMap.environment" @change="updateUrl" v-if="currentEnvironmentConditionList.length" >
                              <v-btn v-for="environment in currentEnvironmentConditionList" :key="environment" :value="environment">
                                {{$t(environment)}}
                              </v-btn>
                            </v-btn-toggle>
                            <v-btn-toggle class="mr-1"  dense v-if="currentBuffCondition.length" v-model="conditionMap.buff">
                              <v-btn disabled value="強化状態">
                                強化時
                              </v-btn>
                            </v-btn-toggle>
                            <v-btn-toggle class="mr-1"  dense v-model="conditionMap.counter" @change="updateUrl" v-if="currentCounterConditionList.length" >
                              <v-btn v-for="counter in currentCounterConditionList" :key="counter" :value="counter">
                                {{$t(counter)}}
                              </v-btn>
                            </v-btn-toggle>
                            <v-btn-toggle class="mr-1"  dense v-model="conditionMap.operate" @change="updateUrl" v-if="currentOperateConditionList.length" >
                              <v-btn v-for="operate in currentOperateConditionList" :key="operate" :value="operate">
                                {{$t(operate)}}
                              </v-btn>
                            </v-btn-toggle>
                          </v-row>
                        </v-container>
                      </v-alert>
                    </v-theme-provider>
                  </v-col>
                </v-row>
                <v-divider />
                <br/>
                <SkillBoostVisualGroup
                  :indeterminate="shouldDisplayBoostLoading"
                  :boost="getSimplifiedSkillAmount()"
                />
                <v-divider />
                <BuffBoostDisplay
                  :boost="getSimplifiedSkillAmount().effectBoost"
                  :range="accumulatedRangeEX"
                  :melee="accumulatedMeleeEX"
                  :meleeValueOrder="meleeValueOrder"
                  :rangeValueOrder="rangeValueOrder"
                />
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
                  <v-col cols="6">
                    <v-btn
                      tile
                      width="100%"
                      @click="updateActiveTagGear(tag)"
                      :class="{
                        primary: wordTagGear.tag === tag,
                      }"
                    >
                      {{ $t(tag) }}
                    </v-btn>
                  </v-col>
                  <v-col cols="6">
                    <v-select
                      :items="getGearLevelList(4)"
                      :disabled="wordTagGear.tag !== tag"
                      v-model="wordTagGear.level"
                      @change="updateUrl"
                      solo
                      dense
                    >
                      <template v-slot:selection="{ item }">
                        <span class="d-flex justify-center" style="width: 100%;">
                          {{ item.label }}
                        </span>
                      </template>
                    </v-select>
                  </v-col>
                </v-row>
              </v-container>
              <v-container>
                <v-row align="center">
                  <v-col cols="4">
                    <v-btn
                      width="100%"
                    >
                      轉換齒輪
                    </v-btn>
                  </v-col>
                  <v-col cols="4">
                    <v-select
                      :items="transformGearList"
                      v-model="transformGear.type"
                      @change="updateUrl"
                      dense
                      solo
                    >
                      <template v-slot:selection="{ item }">
                        <span class="d-flex justify-center" style="width: 100%;">
                          {{ item }}
                        </span>
                      </template>
                    </v-select>
                  </v-col>
                  <v-col cols="4">
                    <v-select
                      :items="getGearLevelList(4)"
                      v-model="transformGear.level"
                      @change="updateUrl"
                      dense
                      solo
                    >
                      <template v-slot:selection="{ item }">
                        <span class="d-flex justify-center" style="width: 100%;">
                          {{ item.label }}
                        </span>
                      </template>
                    </v-select>
                  </v-col>
                </v-row>
                <v-row align="center">
                  <v-col cols="4">
                    <v-btn
                      tile
                      width="100%"
                    >
                      能力齒輪
                    </v-btn>
                  </v-col>
                  <v-col cols="4">
                    <v-select
                      :items="parasmeterGearList"
                      v-model="parameterGear.type"
                      @change="updateUrl"
                      dense
                      solo
                    >
                      <template v-slot:selection="{ item }">
                        <span class="d-flex justify-center" style="width: 100%;">
                          {{ item }}
                        </span>
                      </template>
                    </v-select>
                  </v-col>
                  <v-col cols="4">
                    <v-select
                      :items="getGearLevelList(5)"
                      v-model="parameterGear.level"
                      @change="updateUrl"
                      dense
                      solo
                    >
                      <template v-slot:selection="{ item }">
                        <span class="d-flex justify-center" style="width: 100%;">
                          {{ item.label }}
                        </span>
                      </template>
                    </v-select>
                  </v-col>
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
              @mouseleave="shouldDisplayWordTagPicker[value.original]=false"
              three-line
              v-for="(value, key) in position"
              :key="key"
              @click.stop="updatePosition(value.original)"
              :class="{
                disabled: data[value.original].disabled,
              }"
            >
              <v-list-item-icon>
                <AppCacheImage
                  v-if="!data[value.original].isEmpty"
                  height="30px"
                  width="30px"
                  :src="data[value.original].main.icon"
                />
                <v-img
                  v-else
                  height="30px"
                  width="30px"
                  :src="value.icon"
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
                        @click.stop="data[value.original].toggleActivation(); updateUrl();"
                      >
                        {{ $t(data[value.original].main.name) }}
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
                        @click.stop="data[value.original].toggleActivation(); updateUrl();"
                      >
                        {{ $t(data[value.original].sub.name) }}
                      </v-btn>
                    </div>
                  </template>
                </v-list-item-title>
                <v-list-item-subtitle
                  class="align-right"
                  v-if="shouldDisplayWordTagPicker[value.original]"
                >
                  <v-btn-toggle @click.prevent.stop>
                    <v-btn
                      x-small
                      tile
                      :color="data[value.original].activeWordTags.indexOf(data[value.original].main.wordTag1) >= 0 ? 'primary' : 'secondary'"
                      v-if="data[value.original].main.wordTag1"
                      @click="updateWordTag(value.original, data[value.original].main.wordTag1)"
                    >
                      {{ $t(data[value.original].main.wordTag1) }}
                    </v-btn>
                    <v-btn
                      x-small
                      tile
                      :color="data[value.original].activeWordTags.indexOf(data[value.original].main.wordTag2) >= 0 ? 'primary' : 'secondary'"
                      v-if="data[value.original].main.wordTag2"
                      @click="updateWordTag(value.original, data[value.original].main.wordTag2)"
                    >
                      {{ $t(data[value.original].main.wordTag2) }}
                    </v-btn>
                  </v-btn-toggle>
                </v-list-item-subtitle>
                <v-list-item-subtitle
                  v-else-if="data[value.original].activePassive1($t)"
                  :class="{
                    'overflow-x-hidden': true,
                    'white--text': data[value.original].passive1Passed
                  }"
                >
                  <v-icon small v-if="data[value.original].passive1Passed">
                    mdi-check-bold
                  </v-icon>
                  <v-icon v-else>
                    mdi-alert-circle-outline
                  </v-icon>
                  {{ $t(data[value.original].activePassive1($t)) }}
                </v-list-item-subtitle>
                <v-list-item-subtitle v-else>
                  -
                </v-list-item-subtitle>
                <v-list-item-subtitle
                  class="align-right"
                  v-if="shouldDisplayWordTagPicker[value.original]"
                >
                  <v-btn-toggle @click.prevent.stop right absolute>
                    <v-btn
                      x-small
                      tile
                      :color="data[value.original].activeWordTags.indexOf(data[value.original].sub.wordTag1) >= 0 ? 'primary' : 'secondary'"
                      v-if="data[value.original].sub.wordTag1"
                      @click="updateWordTag(value.original, data[value.original].sub.wordTag1)"
                    >
                      {{ $t(data[value.original].sub.wordTag1) }}
                    </v-btn>
                    <v-btn
                      x-small
                      tile
                      :color="data[value.original].activeWordTags.indexOf(data[value.original].sub.wordTag2) >= 0 ? 'primary' : 'secondary'"
                      v-if="data[value.original].sub.wordTag2"
                      @click="updateWordTag(value.original, data[value.original].sub.wordTag2)"
                    >
                      {{ $t(data[value.original].sub.wordTag2) }}
                    </v-btn>
                  </v-btn-toggle>
                </v-list-item-subtitle>
                <v-list-item-subtitle
                  v-else-if="data[value.original].activePassive2($t)"
                  :class="{
                    'overflow-x-hidden': true,
                    'white--text': data[value.original].passive2Passed
                  }"
                >
                  <v-icon small v-if="data[value.original].passive2Passed">
                    mdi-check-bold
                  </v-icon>
                  <v-icon v-else>
                    mdi-alert-circle-outline
                  </v-icon>
                  {{ $t(data[value.original].activePassive2($t))}}
                </v-list-item-subtitle>
                <v-list-item-subtitle v-else>
                  -
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action width="80px" @click.stop @mouseenter="shouldDisplayWordTagPicker[value.original]=true">
                <v-badge
                  v-for="(tag, index) in data[value.original].wordTags"
                  :key="index"
                  :content=" activeWordTagMap[tag] "
                  inline
                  :title="$t(tag)"
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
                    @click.stop="updateWordTag(data.original, tag)"
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
import domtoimage from 'dom-to-image';
import { directive as onClickaway } from "vue-clickaway";
import POSITION from "@/constants/position";
import PartCombinator from "@/models/PartCombinator";
import TAG from "@/constants/tag.json";
import TAGGEAR from "@/constants/taggear.json";
import TAG_DATA from "@/constants/TAG_DATA.json";
import JOB_DATA from "@/constants/JOB_DATA.json";
import TRANSFORM_GEAR_DATA from "@/constants/TRANSFORM_GEAR_DATA.json";
import PARAMETER_GEAR_DATA from "@/constants/PARAMETER_GEAR_DATA.json";
import CONDITION_CATEGORY_DATA from '@/constants/CONDITION_CATEGORY_DATA.json';
import CONDITION_ATTACK_TYPE_DATA from '@/constants/CONDITION_ATTACK_TYPE_DATA.json';
import CONDITION_ENVIRONMENT_DATA from '@/constants/CONDITION_ENVIRONMENT_DATA.json';
import CONDITION_TEAM_DATA from '@/constants/CONDITION_TEAM_DATA.json';
import CONDITION_COUNTER_DATA from '@/constants/CONDITION_COUNTER_DATA.json';
import CONDITION_OPERATE_DATA from '@/constants/CONDITION_OPERATE_DATA.json';
import AppCacheImage from '@/components/AppCacheImage.vue';
import SkillBoostVisualGroup from '@/components/SkillBoostVisualGroup.vue';
import BuffBoostDisplay from '@/components/BuffBoostDisplay.vue';
import CalculatorPartPicker from '@/components/CalculatorPartPicker.vue';

function add(a, b) {
  return {
    rangeBoost: +a.rangeBoost + (b.rangeBoost || 0),
    meleeBoost: +a.meleeBoost + (b.meleeBoost || 0),
    exBoost: +a.exBoost + (b.exBoost || 0),
    effectBoost: +a.effectBoost + (b.effectBoost || 0),
    initialCharge: +a.initialCharge + (b.initialCharge || 0),
    cooldownReduction: +a.cooldownReduction + (b.cooldownReduction || 0),
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
  name: 'AdvancedCalculator',
  props: {
    machineDataManager: {
      type: Object,
    },
  },
  directives: {
    onClickaway,
  },
  components: {
    AppCacheImage,
    SkillBoostVisualGroup,
    BuffBoostDisplay,
    CalculatorPartPicker,
  },
  data: () => ({
    dialog: false,
    linearMode: false,
    panel: [0, 2],
    parts: [],
    partTypeMap: [],
    loading: true,
    currentPosition: "",
    currentWeaponCategory: "",
    session: -1,
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
    shouldDisplayWordTagPicker: {
      頭: false,
      胴体: false,
      腕: false,
      脚部: false,
      背中: false,
      盾: false,
      格闘武器: false,
      射撃武器: false,
      パイロット: false,
    },
    TAG,
    TAGGEAR,
    jobGear: {
      job: 'All-Rounder',
      level: 0,
    },
    wordTagGear: {
      tag: '',
      level: 0,
    },
    parameterGear: {
      type: '射擊攻擊力',
      level: 0,
    },
    transformGear: {
      type: '射擊轉換',
      level: 0,
    },
    conditionMap: {
      team: '',
      type: 'ビーム',
      category: '',
      buff: '強化状態',
      armor: '',
      counter: '',
      operate: '',
    },
    partsById: {},
    machines: {},
    achievementAffectedGearEffectRatio: 1.15,
    displayLoadLocalData: false,
  }),

  computed: {
    tableData() {
      return {
        '耐久力': Math.round(this.calculatedArmor),
        '格鬥攻擊力': Math.round(this.calculatedMeleeAttack),
        '射擊攻擊力': Math.round(this.calculatedRangeAttack),
        '格鬥防禦力': Math.round(this.calculatedMeleeDefense),
        '射擊防禦力': Math.round(this.calculatedRangeDefense),
        '物理耐性': Math.round(this.calculatedPhysicalResistence),
        '光束耐性': Math.round(this.calculatedBeamResistence),
      };
    },
    shouldOrderRangeValueFirst() {
      return this.accumulatedRangeEX >= this.accumulatedMeleeEX;
    },
    meleeValueOrder() {
      return this.shouldOrderRangeValueFirst ? 'order-2' : 'order-1';
    },
    rangeValueOrder() {
      return this.shouldOrderRangeValueFirst ? 'order-1' : 'order-2';
    },
    shouldDisableJobSelector() {
      return this.data['パイロット'].main.isEmpty;
    },
    shouldDisableJobLevelSelector() {
      return this.jobGear.job === 'All-Rounder';
    },
    currentAttackTypeList() {
      return [...new Set(Object.values(CONDITION_ATTACK_TYPE_DATA).map((c) => c.text))];
    },
    currentWeaponCategoryConditionList() {
      return [...new Set(Object.values(this.data).map((pc) => {
        return pc.activePart.passives;
      }).flat().filter((passive) => passive?.$conditionType === 'category').map((passive) => (passive.$condition)))];
    },
    currentTeamList() {
      return [...new Set(Object.values(this.data).map((pc) => {
        return pc.activePart.passives;
      }).flat().filter((passive) => passive?.$conditionType === 'team').map((passive) => (passive.$condition)))];
    },
    currentEnvironmentConditionList() {
      return [...new Set(Object.values(this.data).map((pc) => {
        return pc.activePart.passives;
      }).flat().filter((passive) => passive?.$conditionType === 'environment').map((passive) => (passive.$condition)))];
    },
    currentBuffCondition() {
      return Object.values(this.data).map((pc) => {
        return pc.activePart.passives;
      }).flat().filter((passive) => passive?.$conditionType === 'buff').map((passive) => (passive.$condition));
    },
    currentCounterConditionList() {
      return [...new Set(Object.values(this.data).map((pc) => {
        return pc.activePart.passives;
      }).flat().filter((passive) => passive?.$conditionType === 'counter').map((passive) => (passive.$condition)))];
    },
    currentOperateConditionList() {
      return [...new Set(Object.values(this.data).map((pc) => {
        return pc.activePart.passives;
      }).flat().filter((passive) => passive?.$conditionType === 'operate').map((passive) => (passive.$condition)))];
    },
    mappedConditionMap() {
      return {
        ...this.conditionMap,
        attribute: this.activeAttribute,
        wordTags: this.activeWordTags,
        job: this.jobGear.job,
      };
    },
    shouldDisplayBoostLoading() {
      return this.loading && this.$route.params.data !== '';
    },
    jobMapByText() {
      return convertArrayToObject(Object.values(JOB_DATA), 'text');
    },
    tagMapByText() {
      return convertArrayToObject(Object.values(TAG_DATA), 'text');
    },
    transformMapByText() {
      return convertArrayToObject(Object.values(TRANSFORM_GEAR_DATA), 'text');
    },
    parameterMapByText() {
      return convertArrayToObject(Object.values(PARAMETER_GEAR_DATA), 'text');
    },
    parasmeterGearList() {
      return Object.values(PARAMETER_GEAR_DATA).map((g) => g.text);
    },
    transformGearList() {
      return Object.values(TRANSFORM_GEAR_DATA).map((g) => g.text);
    },
    conditionMapByText() {
      return {
        type: convertArrayToObject(Object.values(CONDITION_ATTACK_TYPE_DATA), 'text'),
        category: convertArrayToObject(Object.values(CONDITION_CATEGORY_DATA), 'text'),
        team: convertArrayToObject(Object.values(CONDITION_TEAM_DATA), 'text'),
        environment: convertArrayToObject(Object.values(CONDITION_ENVIRONMENT_DATA), 'text'),
        counter: convertArrayToObject(Object.values(CONDITION_COUNTER_DATA), 'text'),
        operate: convertArrayToObject(Object.values(CONDITION_OPERATE_DATA), 'text'),
      };
    },
    debugData() {
      return Object.values(this.data).map((p) => {
        return [
          [p.main.id, p.main.level],
          [p.sub.id, p.sub.level],
          p.activeSubposition,
          ...p.activeWordTags.map((t) => +this.getTagID(t) || ""),
        ];
      });
    },
    urldata() {
      const rows = Object.values(this.data).map((p) => {
        return [
          [p.main.id, p.main.level],
          [p.sub.id, p.sub.level],
          p.activeSubposition,
          ...p.activeWordTags.map((t) => +this.getTagID(t) || ""),
        ];
      });
      const data = [
        1, // data version
        rows, // parts data
        [+this.jobMapByText[this.jobGear.job]?.id, this.jobGear.level], // job
        [this.wordTagGear.tag !== '' ? this.tagMapByText[this.wordTagGear.tag]?.id : '', this.wordTagGear.level], // tag
        [+this.transformMapByText[this.transformGear.type]?.id, this.transformGear.level], // transform
        [+this.parameterMapByText[this.parameterGear.type]?.id, this.parameterGear.level], // parameter
        [0, 0], // last gear,
        [
          this.conditionMap.type ? +this.conditionMapByText.type[this.conditionMap.type].id : '',
          this.conditionMap.category ? +this.conditionMapByText.category[this.conditionMap.category].id : '',
          this.conditionMap.environment ? +this.conditionMapByText.environment[this.conditionMap.environment].id : '',
          this.conditionMap.team ? +this.conditionMapByText.team[this.conditionMap.team].id : '',
          this.conditionMap.counter ? +this.conditionMapByText.counter[this.conditionMap.counter].id : '',
          this.conditionMap.operate ? +this.conditionMapByText.operate[this.conditionMap.operate].id : '',
        ], // extra condition setting
      ];
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
            initialCharge: 0,
            cooldownReduction: 0,
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
          initialCharge: 0,
          cooldownReduction: 0,
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
              initialCharge: 0,
              cooldownReduction: 0,
            };
          }
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
        (1 + (this.getSimplifiedSkillAmount().rangeBoost + this.getSimplifiedSkillAmount().exBoost) / 100) *
          this.calculatedRangeAttack
      );
    },
    accumulatedMeleeEX() {
      return Math.round(
        (1 + (this.getSimplifiedSkillAmount().meleeBoost + this.getSimplifiedSkillAmount().exBoost) / 100) *
          this.calculatedMeleeAttack
      );
    },
    calculatedMeleeAttack() {
      return (Object.values(this.data).reduce((a, b) => a + b.meleeAttack, 0)
        + this.jobAffectedMeleeAttack
        + (this.transformAffectedMeleeAttack || 0)
        + (this.parameterAffectedMeleeAttack || 0)
        + this.wordTagGearAffectedMeleeAttack)
        * this.wordTagGearAffectedMeleeAttackRatio * this.jobAffectedMeleeAttackIncrementedRatio;
    },
    calculatedRangeAttack() {
      return (Object.values(this.data).reduce((a, b) => a + b.rangeAttack, 0)
        + this.jobAffectedRangeAttack
        + this.transformAffectedRangeAttack
        + this.parameterAffectedRangeAttack
        + this.wordTagGearAffectedRangeAttack)
        * this.wordTagGearAffectedRangeAttackRatio * this.jobAffectedRangeAttackIncrementedRatio;
    },
    transformAffectedRangeAttack() {
      return this.transformGear.type && this.transformGear.type !== '格鬥轉換' && this.transformGear.level
        ? (this.transformMapByText[this.transformGear.type].values[this.transformGear.level - 1] || 0) * (
          this.transformGear.type === 'armor' ? this.calculatedArmor : this.calculatedRangeDefense
        ) * this.achievementAffectedGearEffectRatio : 0;
    },
    transformAffectedMeleeAttack() {
      return this.transformGear.type && this.transformGear.type !== '射擊轉換' && this.transformGear.level
        ? (this.transformMapByText[this.transformGear.type].values[this.transformGear.level - 1] || 0) * (
          this.transformGear.type === 'armor' ? this.calculatedArmor : this.calculatedMeleeDefense
        ) * this.achievementAffectedGearEffectRatio : 0;
    },
    jobAffectedRangeAttackIncrementedRatio() {
      switch (this.jobGear.job) {
        case 'Long-Shooter':
        case 'Middle-Shooter':
          return 1.1;
        default:
          return 1;
      }
    },
    wordTagGearAffectedRangeAttackRatio() {
      if (!this.activeWordTags.length) {
        return 1;
      }
      if (!this.wordTagGear.tag) {
        return 1;
      }
      return this.activeWordTags.reduce((a, current) => {
        if (current === this.wordTagGear.tag && this.wordTagGear.level) {
          return a + ((this.TAGGEAR[this.wordTagGear.tag][this.wordTagGear.level - 1][0] / 100) * this.TAG[this.wordTagGear.tag].rangeAttack) / 100;
        }
        return a + this.TAG[this.wordTagGear.tag].rangeAttack / 100;
      }, 1);
    },
    wordTagGearAffectedRangeAttack() {
      if (!this.activeWordTags.length) {
        return 0;
      }
      if (!this.wordTagGear.tag) {
        return 0;
      }
      if (!this.wordTagGear.level) {
        return 0;
      }
      return this.TAGGEAR[this.wordTagGear.tag][this.wordTagGear.level - 1][1].rangeAttack;
    },
    parameterAffectedRangeAttack() {
      return this.parameterGear.type && this.parameterGear.level ? (this.parameterMapByText[this.parameterGear.type].values[this.parameterGear.level - 1]?.rangeAttack || 0) : 0;
    },
    jobAffectedRangeAttack() {
      return this.jobGear.job && this.jobGear.level ? (this.jobMapByText[this.jobGear.job].values[this.jobGear.level - 1]?.rangeAttack || 0) * this.achievementAffectedGearEffectRatio : 0;
    },
    // melee
    jobAffectedMeleeAttackIncrementedRatio() {
      switch (this.jobGear.job) {
        case 'In-Fighter':
        case 'Out-Fighter':
          return 1.1;
        default:
          return 1;
      }
    },
    wordTagGearAffectedMeleeAttackRatio() {
      if (!this.activeWordTags.length) {
        return 1;
      }
      if (!this.wordTagGear.tag) {
        return 1;
      }
      return this.activeWordTags.reduce((a, current) => {
        if (current === this.wordTagGear.tag && this.wordTagGear.level) {
          return a + ((this.TAGGEAR[this.wordTagGear.tag][this.wordTagGear.level - 1][0] / 100) * this.TAG[this.wordTagGear.tag].meleeAttack) / 100;
        }
        return a + this.TAG[this.wordTagGear.tag].meleeAttack / 100;
      }, 1);
    },
    wordTagGearAffectedMeleeAttack() {
      if (!this.activeWordTags.length) {
        return 0;
      }
      if (!this.wordTagGear.tag) {
        return 0;
      }
      if (!this.wordTagGear.level) {
        return 0;
      }
      return this.TAGGEAR[this.wordTagGear.tag][this.wordTagGear.level - 1][1].meleeAttack;
    },
    parameterAffectedMeleeAttack() {
      return this.parameterGear.type && this.parameterGear.level
          ? (this.parameterMapByText[this.parameterGear.type].values[this.parameterGear.level - 1].meleeAttack || 0)
          : 0;
    },
    jobAffectedMeleeAttack() {
      return this.jobGear.job && this.jobGear.level ? (this.jobMapByText[this.jobGear.job].values[this.jobGear.level - 1]?.meleeAttack || 0) * this.achievementAffectedGearEffectRatio : 0;
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
    attributeMap() {
      const properties = {
        "Power": 0,
        "Technique": 0,
        "Speed": 0,
      };
      Object.values(this.data).forEach((p) => {
        const t = p.main.attribute;
        if (!t) {
          return;
        }
        if (!properties[t]) {
          properties[t] = 0;
        }
        properties[t] += 1;
      });
      return properties;
    },
    attributeMapString() {
      return Object.entries(this.attributeMap).map(([k, v]) => (`${k[0]}:${v}`)).join(' ');
    },
    activeAttribute() {
      const r = Object.entries(this.attributeMap).filter(([, value]) => value >= 5);
      if (r.length) {
        return r[0][0];
      } else {
        return "無";
      }
    },
    simplifiedActiveAttribute() {
      return this.activeAttribute[0];
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

    allJobList() {
      return Object.values(JOB_DATA).map(j => j.text);
    },

    jobList() {
      return ['All-Rounder'].concat(Object.values(JOB_DATA).filter((job) => (this.data['パイロット'].main.options.aiJob || '').indexOf(job.text) >= 0).map((job) => job.text));
    },

    pickingSub() {
      if (!this.currentPosition) {
        return false;
      }
      return this.data[this.currentPosition].nextInsertingSubposition === 1;
    },
  },

  watch: {
    keyword(val) {
      this.search = val;
    },
  },

  methods: {
    loadMachineData(data) {
      this.displayLoadLocalData = false;
      this.session = data.id;
      if (this.urldata === data.machine) {
        return;
      }
      this.loading = true;
      this.$router.replace({
        name: 'AdvacnedCalculatorData',
        params: { data: data.machine },
      }, () => {
        this.emptyData();
        this.$nextTick(() => {
          this.loadDataFromURL();
          this.loading = false;
        });
      });
    },
    loadLocalData() {
      this.displayLoadLocalData = false;
      this.session = +window.localStorage.getItem('gbmac-latest-id');

      this.$router.replace({
        name: 'AdvacnedCalculatorData',
        params: { data: window.localStorage.getItem('gbmac-latest-data') },
      }, () => {
        this.loadDataFromURL();
        this.$emit('active', this.session);
      });
    },
    getSimplifiedSkillAmount() {
      let result = {
        exBoost: 0,
        rangeBoost: 0,
        meleeBoost: 0,
        effectBoost: 0,
        initialCharge: 0,
        cooldownReduction: 0,
      };
      Object.values(this.data).forEach((pc) => {
        result = add(result, pc.passive1SkillEffect);
        result = add(result, pc.passive2SkillEffect);
      });
      return result;
    },
    updateActiveTagGear(tag) {
      this.wordTagGear.tag = tag;
      this.updateUrl();
    },
    getGearLevelList(max) {
      return new Array(max + 1).fill('x').map((_, i) => ({
        label: `LV.${i}`,
        text: `LV.${i}`,
        value: i,
      }));
    },
    closeTable() {
      this.dialog = false;
      this.currentPosition = "";
      this.currentWeaponCategory = '';
    },
    getTagIcon(text) {
      return Object.values(TAG_DATA).find((data) => data.text === text)?.icon;
    },
    getTagID(text) {
      return Object.values(TAG_DATA).find((data) => data.text === text).id;
    },
    updateUrl() {
      this.$router.replace({
        name: 'AdvacnedCalculatorData',
        params: { data: this.urldata },
      });
      window.localStorage.setItem('gbmac-latest-data', this.urldata);
      this.session = this.machineDataManager && this.machineDataManager.save({
        machine: this.urldata,
        id: this.session,
        preview: `${this.simplifiedActiveAttribute}屬/${this.jobGear.job}/格${this.accumulatedMeleeEX}/射${this.accumulatedRangeEX}/初充${this.getSimplifiedSkillAmount().initialCharge}%/CDR${this.getSimplifiedSkillAmount().cooldownReduction}%`,
      });
      window.localStorage.setItem('gbmac-latest-id', this.session);
    },
    emptyData() {
      Object.values(this.data).forEach((pc) => {
        pc.main.reset();
        pc.sub.reset();
      });
    },
    loadDataFromURL() {
      let { data } = this.$route.params;
      if (!data) {
        if (window.localStorage.getItem('gbmac-latest-id')) {
          this.displayLoadLocalData = true;
        }
        return;
      }
      data = JSON.parse(lzbase62.decompress(data));
      console.log(data);
      data[1].forEach(([main, sub, active, tag1, tag2], index) => {
        console.log(main, sub, active, tag1, tag2);
        const pc = Object.values(this.data)[index];
        if (main[0]) {
          const mainPart = {
            ...this.partsById[+main[0]],
            machineName: this.$t(this.partsById[+main[0]].machineName || this.partsById[+main[0]].aiName),
          };
          if (mainPart) {
            pc.insert(mainPart);
          }
        }
        if (sub[0]) {
          const subPart = {
            ...this.partsById[+sub[0]],
            machineName: this.$t(this.partsById[+sub[0]].machineName || this.partsById[+sub[0]].aiName),
          };
          if (subPart) {
            pc.insert(subPart);
          }
        }
        pc.activeSubposition = +active;
        if (tag1 !== "" && TAG_DATA[tag1]?.text) {
          pc.addWordTag(TAG_DATA[tag1].text);
        }
        if (tag2 !== "" && TAG_DATA[tag2]?.text) {
          pc.addWordTag(TAG_DATA[tag2].text);
        }
      });
      this.checkIntegrated();
      this.jobGear.job = JOB_DATA[data[2][0] || 0].text;
      this.jobGear.level = data[2][1];
      this.wordTagGear.tag = data[3][0] !== '' ? TAG_DATA[data[3][0]].text : '';
      this.wordTagGear.level = data[3][1];
      this.transformGear.type = TRANSFORM_GEAR_DATA[data[4][0]].text;
      this.transformGear.level = data[4][1];
      this.parameterGear.type = PARAMETER_GEAR_DATA[data[5][0]].text;
      this.parameterGear.level = data[5][1];
      this.conditionMap.type = data[7][0] !== '' ? CONDITION_ATTACK_TYPE_DATA[+data[7][0]]?.text || '' : '';
      this.conditionMap.category = data[7][1] !== '' ? CONDITION_CATEGORY_DATA[+data[7][1]]?.text || '' : '';
      this.conditionMap.environment = data[7][2] !== '' ? CONDITION_ENVIRONMENT_DATA[+data[7][2]]?.text || '' : '';
      this.conditionMap.team = data[7][3] !== '' ? CONDITION_TEAM_DATA[+data[7][3]]?.text || '' : '';
      this.conditionMap.counter = data[7][4] !== '' ? CONDITION_COUNTER_DATA[+data[7][4]]?.text || '' : '';
      this.conditionMap.operate = data[7][5] !== '' ? CONDITION_OPERATE_DATA[+data[7][5]]?.text || '' : '';
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
    checkIntegrated() {
      Object.values(this.data).forEach((p) => {
        p.enable();
      });
      Object.values(this.data).forEach((p) => {
        if (p.main.options.integrated) {
          const position = this.position[p.main.options.integrated.replace('＋', '').toLowerCase()].original;
          console.log(position);
          this.data[position].disable();
          console.log(this.data[position].disabled);
        }
      });
    },
    selectPart(part) {
      this.displayLoadLocalData = false;
      this.data[this.currentPosition].insert(part);
      this.checkIntegrated(part);
      this.bestFitCondition(part);
      this.closeTable();
      this.updateUrl();
    },
    bestFitCondition(part) {
      if (this.jobList.indexOf(this.jobGear.job) < 0) {
        this.jobGear.job = 'All-Rounder';
      }
      if (this.activeWordTags.indexOf(this.wordTagGear.tag) < 0) {
        this.wordTagGear.tag = '';
        // pick one if cleared
        if (this.activeWordTags.length) {
          this.wordTagGear.tag = this.activeWordTags[0];
        }
      }
      if (part && part.$condition && part.$conditionType === 'category' && this.conditionMap.category === '') {
        this.conditionMap.category = part.$conditionType;
      }
    },
    endCompose() {},
    updateQuery() {
      this.$router.push({
        query: {
          keyword: this.search,
        },
      });
    },
    updateWordTag(position, tag) {
      this.data[position].addWordTag(tag);
      this.bestFitCondition();
      this.updateUrl();
    },
    updatePosition(position) {
      if (this.data[position].disabled) {
        return;
      }
      if (this.shouldDisplayWordTagPicker[position]) {
        return;
      }
      this.currentPosition = position;
      if (['格闘武器', '射撃武器'].indexOf(position) >= 0) {
        if (this.data[position].nextInsertingSubposition === 1) {
          this.currentWeaponCategory = this.data[position].main.options.weaponType;
        }
      }
      this.dialog = true;
    },
    away() {
      this.currentPosition = "";
      this.searchName = "";
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
    download() {
      domtoimage.toJpeg(document.getElementById('my-build')).then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = `build-${new Date().getTime()}.jpeg`;
        link.href = dataUrl;
        link.click();
      });
    },
  },

  mounted() {
    this.$vuetify.theme.dark = true;
    window.app4 = this;
    window.lzbase62 = lzbase62;
    const prefix =
      process.env.NODE_ENV === "production" ? "/vue-gbm-alive/" : "/";
    Object.values(this.data).forEach((pc) => {
      pc.installCondition(this);
    });
    axios
      .get(`${prefix}part_data_with_id.json`, {
        responseType: "json",
      })
      .then((d1) => {
        this.partsById = d1.data;
        this.loadDataFromURL();
        return axios.get(`${prefix}wiki.json`, {
          responseType: "json",
        });
      }).then((d2) => {
        this.parts = d2.data.wiki;
        this.loading = false;
      });
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
/deep/ .v-text-field.v-text-field--solo.v-input--dense > .v-input__control {
  max-height: 10px;
  height: 36px;
}
.disabled {
  background-color: darkred;
}
.scroll {
  height:200px;/* or any height you want */
  overflow-y:auto
}
.align-right {
  display: flex;
  justify-content: flex-end;
}
</style>
