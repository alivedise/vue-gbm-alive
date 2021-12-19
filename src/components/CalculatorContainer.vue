<template>
  <v-container>
    <v-btn v-if="$vuetify.breakpoint.mobile"
      width="100%"
      @click.stop="showDrawer"
      v-show="machineDataManager.machines.length"
    >
      已儲存機體列表
    </v-btn>
    <SavedMachineList
      :drawer="drawer"
      ref="list"
      :machineDataManager="machineDataManager"
      @load="load"
    />
    <AdvancedCalculator ref="calculator" :machineDataManager="machineDataManager" @active="setActive" />
  </v-container>
</template>

<script>
import SavedMachineList from '@/components/SavedMachineList.vue';
import AdvancedCalculator from '@/components/AdvancedCalculator.vue';
import MachineDataManager from '@/models/MachineDataManager';

export default {
  name: 'CalculatorContainer',
  components: {
    SavedMachineList,
    AdvancedCalculator,
  },
  data() {
    return {
      machineDataManager: new MachineDataManager(),
      drawer: false,
    };
  },
  methods: {
    showDrawer() {
      this.$refs.list.drawer = true;
    },
    load(data) {
      this.$refs.calculator.loadMachineData(data);
    },
    setActive(active) {
      this.$refs.list.active = active;
    },
  }
}
</script>

<style>

</style>