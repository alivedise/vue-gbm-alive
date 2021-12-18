export default class MachineDataManager {
  MAX_SLOT = 10;

  PREFIX = 'gbmac-machine-';

  constructor() {
    this.$machines = [];
    // this.getMachineList();
  }

  getMachineList() {
    new Array(this.MAX_SLOT).fill('x').some((_, i) => {
      const machine = window.localStorage.getItem(`${this.PREFIX}${i}`);
      if (machine) {
        this.$machines.push(JSON.parse(machine));
      }
    });
  }

  getSavingDataKey() {
    let emptyId = this.$machines.length;
    if (emptyId >= this.MAX_SLOT) {
      emptyId = this.$machines.sort((a, b) => {
        if (a.timestamp > b.timestamp) {
          return 1;
        }
        if (a.timestamp < b.timestamp) {
          return -1;
        }
        return 0;
      })[0].id;
    }
    return emptyId;
  }

  get machines() {
    return this.$machines;
  }

  save(data) {
    let id = data.id >= 0 ? data.id : this.getSavingDataKey();
    data.id = id;
    data.timestamp = new Date().getTime();
    window.localStorage.setItem(`${this.PREFIX}${id}`, JSON.stringify(data));
    return id;
  }
}
