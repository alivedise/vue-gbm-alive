<template>
  <v-container>
    <v-progress-linear
      v-model="boost"
      color="amber darken"
      height="15"
    >
      強化效果上升<strong>{{ boost }}%</strong>
    </v-progress-linear>
    <v-row>
      <v-col>
        <h2>
          <v-icon>mdi-arrow-up</v-icon>
          <h5>單攻擊強化</h5>
          <h4 :class="rangeValueOrder">
            <v-img src="@/assets/i_04.svg" width="20" class="d-inline-flex" />{{ singleBuffRangeEX }}
          </h4>
          <h4 :class="meleeValueOrder">
            <v-img src="@/assets/i_03.svg" width="20" class="d-inline-flex" />{{ singleBuffMeleeEX }}
          </h4>
        </h2>
      </v-col>
      <v-col>
        <h2>
          <v-icon>mdi-arrow-up</v-icon>
          <v-icon>mdi-arrow-up</v-icon>
          <h5>雙攻擊強化</h5>
          <h4 :class="rangeValueOrder">
            <v-img src="@/assets/i_04.svg" width="20" class="d-inline-flex" />{{ doubleBuffRangeEX }}
          </h4>
          <h4 :class="meleeValueOrder">
            <v-img src="@/assets/i_03.svg" width="20" class="d-inline-flex" />{{ doubleBuffMeleeEX }}
          </h4>
        </h2>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "BuffBoostDisplay",
  props: {
    boost: {
      type: Number,
    },
    melee: {
      type: Number,
    },
    range: {
      type: Number,
    },
    meleeValueOrder: {
      type: String,
    },
    rangeValueOrder: {
      type: String,
    },
  },
  computed: {
    effectBoostAmount() {
      return 1 + this.boost / 100;
    },
    singleBuffRangeEX() {
      return Math.round((1 + 0.3 * this.effectBoostAmount) * this.range);
    },
    doubleBuffRangeEX() {
      return Math.round(
        (1 + 0.3 * this.effectBoostAmount) *
          (1 + 0.3 * this.effectBoostAmount) *
          this.range
      );
    },
    singleBuffMeleeEX() {
      return Math.round((1 + 0.3 * this.effectBoostAmount) * this.melee);
    },
    doubleBuffMeleeEX() {
      return Math.round(
        (1 + 0.3 * this.effectBoostAmount) *
          (1 + 0.3 * this.effectBoostAmount) *
          this.melee
      );
    },
  },
};
</script>

<style>
</style>
