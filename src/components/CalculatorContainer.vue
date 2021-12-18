<template>
  <v-container>
    <SavedMachineList ref="list" :machineDataManager="machineDataManager" @load="load" />
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
    };
  },
  methods: {
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