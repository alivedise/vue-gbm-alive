<template>
  <v-container>
    <v-btn
      @click.stop="showDrawer"
      v-show="machineDataManager.machines.length"
    >
      已儲存機體列表
    </v-btn>
    <v-btn
      @click="download"
    >
      下載配置圖
    </v-btn>
    <v-btn
      @click="refresh"
      color="secondary"
      v-show="!forceRefresed"
    >
      強制更新資料
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
      forceRefresed: false,
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
    download() {
      this.$refs.calculator.download();
    },
    refresh() {
      this.$router.push({
        query: {
          t: new Date().getTime(),
        },
      }).then(() => {
        return this.$router.push({
          query: {},
        });
      }).then(() => {
        this.forceRefresed = true;
      });
    },
  },
};
</script>

<style>

</style>
