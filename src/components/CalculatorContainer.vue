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
      @click="copy"
    >
      取得機體網址
      <v-icon v-if="copied" color="green">
        mdi-check
      </v-icon>
    </v-btn>
    <v-btn
      @click="refresh"
      color="secondary"
      v-show="false"
    >
      強制更新資料
    </v-btn>
    <v-btn v-if="name" outlined>
      {{name}}
    </v-btn>
    <SavedMachineList
      :drawer="drawer"
      ref="list"
      :machineDataManager="machineDataManager"
      @load="load"
    />
    <AdvancedCalculator
      ref="calculator"
      :machineDataManager="machineDataManager"
      @active="setActive"
      @namechange="setName"
    />
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
      copied: false,
      name: '',
    };
  },
  watch: {
    '$route.path'() {
      this.copied = false;
    },
  },
  methods: {
    copy() {
      const input = document.createElement('input');
      document.body.appendChild(input);
      input.value = window.location.href;
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      this.copied = true;
    },
    showDrawer() {
      this.$refs.list.drawer = true;
    },
    setName(name) {
      this.name = name;
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
