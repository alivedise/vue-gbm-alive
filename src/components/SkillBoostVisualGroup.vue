<template>
  <v-container>
    <v-row v-if="!$vuetify.breakpoint.mobile">
      <v-col cols="2">
        <v-badge color="primary" :content="'EX加成'" :offset-x="35">
          <v-progress-circular
            :indeterminate="indeterminate"
            :rotate="90"
            :size="70"
            :width="12"
            :value="boost.exBoost"
            color="primary"
          >
            {{ boost.exBoost || 0 }}%
          </v-progress-circular>
        </v-badge>
      </v-col>
      <v-col cols="2">
        <v-badge color="teal" :content="'射攻加成'" :offset-x="35">
          <v-progress-circular
            :indeterminate="indeterminate"
            :rotate="360"
            :size="70"
            :width="12"
            :value="boost.rangeBoost"
            color="teal"
          >
            {{ boost.rangeBoost || 0 }}%
          </v-progress-circular>
        </v-badge>
      </v-col>
      <v-col cols="2">
        <v-badge color="orange" :content="'格攻加成'" :offset-x="35">
          <v-progress-circular
            :indeterminate="indeterminate"
            :rotate="100"
            :size="70"
            :width="12"
            :value="boost.meleeBoost"
            color="orange"
          >
            {{ boost.meleeBoost || 0 }}%
          </v-progress-circular>
        </v-badge>
      </v-col>
      <v-col cols="2">
        <v-badge color="green" :content="'初始充能'" :offset-x="35">
          <v-progress-circular
            :indeterminate="indeterminate"
            :rotate="180"
            :size="70"
            :width="12"
            :value="boost.initialCharge || 0"
            color="green"
          >
            {{ boost.initialCharge || 0 }}%
          </v-progress-circular>
        </v-badge>
      </v-col>
      <v-col cols="2">
        <v-badge color="purple" :content="'減冷卻'" :offset-x="35">
          <v-progress-circular
            :indeterminate="indeterminate"
            :rotate="270"
            :size="70"
            :width="12"
            :value="boost.cooldownReduction"
            color="purple"
          >
            {{ boost.cooldownReduction || 0 }}%
          </v-progress-circular>
        </v-badge>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-progress-linear
        :indeterminate="indeterminate"
        :value="boost.exBoost"
          :height="30"
        color="primary"
      >
        <template v-slot:default="{ value }">
          <strong>EX威力增加{{ Math.ceil(value) }}%</strong>
        </template>
      </v-progress-linear>
        <v-progress-linear
          :indeterminate="indeterminate"
          :value="boost.rangeBoost"
          :height="30"
          color="teal"
        >
          <template v-slot:default="{ value }">
            <strong>射擊威力增加{{ Math.ceil(value) }}%</strong>
          </template>
        </v-progress-linear>
        <v-progress-linear
          :indeterminate="indeterminate"
          :value="boost.meleeBoost"
          :height="30"
          color="orange"
        >
          <template v-slot:default="{ value }">
            <strong>格鬥威力增加{{ Math.ceil(value) }}%</strong>
          </template>
        </v-progress-linear>
        <v-progress-linear
          :indeterminate="indeterminate"
          :value="boost.initialCharge || 0"
          :height="30"
          color="green"
        >
          <template v-slot:default="{ value }">
            <strong>初始充能{{ Math.ceil(value) }}%</strong>
          </template>
        </v-progress-linear>
        <v-progress-linear
          :indeterminate="indeterminate"
          :value="boost.cooldownReduction"
          :height="30"
          color="purple"
        >
          <template v-slot:default="{ value }">
            <strong>冷卻減少{{ Math.ceil(value) }}%</strong>
          </template>
        </v-progress-linear>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'SkillBoostVisualGroup',
  props: {
    boost: {
      type: Object,
    },
    indeterminate: {
      type: Boolean,
    },
  },
};
</script>

<style>
</style>
