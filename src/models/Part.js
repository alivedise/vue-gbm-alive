import EMPTY from '@/constants/EMPTY_PART.json';
import PassiveSkill from '@/models/PassiveSkill.mjs';

let uniq = a => [...new Set(a)];
export default class Part {
  constructor(options = null) {
    if (!options) {
      this.options = JSON.parse(JSON.stringify(EMPTY));
    } else {
      this.options = options;
    }
    this.level = 10;
    if (this.options.passive1) {
      this.passives = [new PassiveSkill(this.options.passive1, this.options.passive1Table), new PassiveSkill(this.options.passive2, this.options.passive2Table)];
    }
    this.linked = [];
  }

  reset() {
    Object.entries(JSON.parse(JSON.stringify(EMPTY))).forEach(([key, value]) => {
      this.options[key] = value;
      this.passives = [new PassiveSkill(this.options.passive1, this.options.passive1Table), new PassiveSkill(this.options.passive2, this.options.passive2Table)];
    });
    this.linked = [];
  }

  get id() {
    return +this.options.id;
  }

  link(part) {
    this.linked.push(part);
  }

  updatePart(part) {
    this.reset();
    Object.entries(part).forEach(([key, value]) => {
      this.options[key] = value;
      this.passives = [new PassiveSkill(this.options.passive1, this.options.passive1Table), new PassiveSkill(this.options.passive2, this.options.passive2Table)];
    });
  }

  get isRainbowRarity() {
    return this.options.icon !== this.options.icon0;
  }

  get attribute() {
    return this.options.property;
  }

  get boostAmount() {
    return (this.passives[0].roughBoost ? +this.options.passive1Table[1][1] : 0)
      + (this.passives[1].roughBoost ? +this.options.passive2Table[1][1] : 0);
  }

  get buffBoostAmount() {
    return (this.passives[0].buffBoost ? +this.options.passive1Table[1][1] : 0)
      + (this.passives[1].buffBoost ? +this.options.passive2Table[1][1] : 0);
  }

  calculateSubBonus(main) {
    let base = 0;
    let bonus = 0;
    if ((main.name.indexOf('BIG') >= 0 && this.name.indexOf('BIG') < 0) || (main.name.indexOf('BIG') < 0 && this.name.indexOf('BIG') >= 0)) {
      base += 20;
    }
    base += this.level * 0.5;
    if (main.wordTag1 === this.wordTag1 || main.wordTag1 === this.wordTag2) {
      bonus += 10;
    }
    if (main.wordTag2 === this.wordTag1 || main.wordTag2 === this.wordTag2) {
      bonus += 10;
    }
    if (main.name.indexOf(this.name) >= 0 || this.name.indexOf(main.name) >= 0) {
      bonus += 30;
    }
    if (bonus > 30) {
      bonus = 30;
    }
    return (bonus + base) / (100 * (this.options.integrated ? 2 : 1));
  }

  get name() {
    return this.options.machineName.replace('【改造】', '').replace('【改造BIG】', '');
  }

  get wordTag1() {
    return this.options.wordTag1;
  }

  get wordTag2() {
    return this.options.wordTag2;
  }

  get wordTags() {
    return uniq([this.options.wordTag1, this.options.wordTag2, ...this.linkedWordTags].filter((d) => d !== ''));
  }

  get linkedWordTags() {
    if (!this.isRainbowRarity) {
      return [];
    }
    return this.linked.map((p) => [p.wordTag1, p.wordTag2]).flat();
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
    return +this.options.melee;
  }

  get rangeAttack() {
    return +this.options.range;
  }

  get meleeDefense() {
    return +this.options.meleeDefense;
  }

  get rangeDefense() {
    return +this.options.rangeDefense;
  }

  get physicalResistence() {
    return +this.options.phyRes;
  }

  get beamResistence() {
    return +this.options.beamRes;
  }

  get armor() {
    return +this.options.stamina;
  }
}
