<template>
  <v-navigation-drawer permanent expand-on-hover absolute
    :mini-variant-width="66"
    v-show="machineDataManager.machines.length"
  >
    <v-list
      nav
      dense
    >
      <v-list-item link v-for="machine in machineDataManager.machines" :key="machine.id">
        <v-list-item-icon>
          <v-chip small label>
            {{ machine.preview.split('/')[1][0] }}
          </v-chip>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{`${machine.preview.split('/')[0]}/${machine.preview.split('/')[1]}`}}</v-list-item-title>
          <v-list-item-subtitle>{{ new Date(machine.timestamp) }}</v-list-item-subtitle>
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
};
</script>

<style>
.job {
  border: solid 1px white;
  padding: 1px;
}
</style>