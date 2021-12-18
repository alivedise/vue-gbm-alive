<template>
  <v-container>
    <SavedMachineList :machineDataManager="machineDataManager" />
    <AdvancedCalculator :machineDataManager="machineDataManager" />
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
}
</script>

<style>

</style>