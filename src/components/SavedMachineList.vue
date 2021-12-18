<template>
  <v-navigation-drawer permanent expand-on-hover absolute
    :mini-variant-width="66"
    v-show="machineDataManager.machines.length"
  >
    <v-list
      nav
      dense
    >
      <v-list-item :class="{
        primary: active === machine.id,
      }" link v-for="machine in machineDataManager.machines" :key="machine.id" @click="load(machine)">
        <v-list-item-icon>
          <v-chip class="job text-center" small label>
            {{ machine.preview.split('/')[1][0] }}
          </v-chip>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{`${machine.preview.split('/')[0]}/${machine.preview.split('/')[1]}`}}</v-list-item-title>
          <v-list-item-subtitle>{{ new Date(machine.timestamp).toLocaleDateString() }} {{new Date(machine.timestamp).toLocaleTimeString()}}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "SavedMachineList",
  props: {
    machineDataManager: {
      type: Object,
    },
  },
  data() {
    return {
      active: -1,
    }
  },
  methods: {
    load(machine) {
      this.active = machine.id;
      this.$emit('load', machine);
    },
  },
};
</script>

<style>
.job {
  min-width: 36px;
  text-align: center;
}
</style>