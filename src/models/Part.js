import EMPTY from '@/constants/EMPTY_PART.json';

export default class Part {
  constructor(options = null) {
    if (!options) {
      this.options = JSON.parse(JSON.stringify(EMPTY));
    } else {
      this.options = options;
    }
  }

  updatePart(part) {
    Object.entries(part).forEach(([key, value]) => {
      this.options[key] = value;
    });
  }

  get name() {
    return this.options.machineName.replace('【改造】', '');
  }

  get icon() {
    return this.options.icon;
  }

  get passive1() {
    return this.options.passive1;
  }

  get passive2() {
    return this.options.passive2;
  }

  get isEmpty() {
    return !this.options.machineName;
  }

  get meleeAttack() {
    return this.options.melee;
  }

  get rangeAttack() {
    return this.options.range;
  }

  get meleeDefense() {
    return this.options.meleeDefense;
  }

  get rangeDefense() {
    return this.options.rangeDefense;
  }

  get physicalResistence() {
    return this.options.phyResist;
  }

  get beamResistence() {
    return this.options.beamResist;
  }

  get armor() {
    return this.options.armor;
  }
}
