<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        GBM database alive
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">v0.0.1a</span>
      </v-btn>
    </v-app-bar>

    <v-main>
      <div v-if="showPositionPicker">
        <v-chip
          class="ma-2"
          label
        >
          Head
        </v-chip>
        <v-chip
          class="ma-2"
          label
        >
          Chest
        </v-chip>
        <v-chip
          class="ma-2"
          label
        >
          Chest
        </v-chip>
        <v-chip
          class="ma-2"
          label
        >
          Arm
        </v-chip>
        <v-chip
          class="ma-2"
          label
        >
          Leg
        </v-chip>
        <v-chip
          class="ma-2"
          label
        >
          Back
        </v-chip>
        <v-chip
          class="ma-2"
          label
        >
          Melee Weapon
        </v-chip>
        <v-chip
          class="ma-2"
          label
        >
          Ranged Weapon
        </v-chip>
        <v-chip
          class="ma-2"
          label
        >
          Shield
        </v-chip>
        <v-chip
          class="ma-2"
          label
        >
          AI
        </v-chip>
      </div>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
      <v-data-table
        :headers="headers"
        :items="mappedParts"
        :items-per-page="20"
        item-key="key"
        class="elevation-1"
        :search="search"
      ></v-data-table>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',

  data: () => ({
    search: '',
    parts: [],
    showPositionPicker: false,
    headers: [
      { text: '部位', value: 'q', sort: false },
      { text: '名稱', value: 'x' },
      { text: '來源', value: 'd' },
      { text: '耐力/Stamina', value: 'e' },
      { text: '格鬥攻擊/melee attack', value: 'f' },
      { text: '轉換格攻/acc. melee attack', value: 'accumluatedMeleeAttack' },
      { text: '射擊攻擊/range attack', value: 'g' },
      { text: '轉換射攻/acc. range attack', value: 'accumluatedRangeAttack' },
      { text: '格鬥防禦/melee defense', value: 'h' },
      { text: '射擊防禦/range defense', value: 'i' },
      { text: '雷射耐性/beam resistance', value: 'j' },
      { text: '物理耐性/physical resistance', value: 'k' },
      { text: '詞彙/tags', value: 'a1' },
      { text: 'passive1/skill', value: 'm' },
      { text: 'passive2', value: 'n' },
      { text: 'added date', value: 'o' },
    ],
    positionFilter: {
      head: false,
      chest: false,
      arm: false,
      back: false,
      leg: false,
      melee: false,
      range: false,
      shield: false,
      ai: false,
    },
  }),

  computed: {
    mappedParts() {
      return this.parts.map((part) => ({
        key: part[0] + part[2],
        name: part[0],
        a: part[1],
        b: part[2],
        c: part[3],
        d: part[4],
        e: part[5],
        f: part[6],
        g: part[7],
        h: part[8],
        i: part[9],
        j: part[10],
        k: part[11],
        l: part[12].replace('<br>', ','),
        m: part[13],
        n: part[14],
        o: part[15],
        p: part[16],
        q: part[17],
        r: part[18],
        w: part[19],
        x: part[20],
        y: part[21],
        z: part[22],
        a1: part[23],
        a2: part[24],
        a3: part[25],
        a4: part[26],
        a5: part[27],
        a6: part[28],
        a7: part[29],
        a8: part[30],
        a9: part[31],
        a0: part[32],
        aa: part[33],
        ab: part[34],
        ac: part[35],
        accumluatedMeleeAttack: Math.floor((+part[6]) + (+part[8] * 0.4)),
        accumluatedRangeAttack: Math.floor((+part[7]) + (+part[9] * 0.4)),
      }));
    },
  },

  mounted() {
    window.app = this;
    const prefix = process.env.NODE_ENV === 'production'
      ? '/vue-gbm-alive/'
      : '/';
    axios.get(`${prefix}parts.json`, {
      responseType: 'json',
    }).then((data) => {
      this.parts = data.data.parts;
    });
  },
};
</script>
