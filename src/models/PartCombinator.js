import Part from '@/models/Part';

export default class PartCombinator {
  constructor(position) {
    this.position = position;
    this.parts = [
      new Part(null, 'main'),
      new Part(null, 'sub'),
    ];
    this.activeSubposition = 0;
    this.activeWordTags = [];
  }

  installCondition(ref) {
    this.ref = ref;
  }

  get passive1Passed() {
    return this.activePart.passives[0].verifyCondition(this.ref.mappedConditionMap);
  }

  get passive1SkillEffect() {
    if (!this.activePart.passives || !this.activePart.passives[0].boostKey) {
      return {};
    }
    if (!this.passive1Passed) {
      return {};
    }
    const o = {};
    console.log(this.activePart.passives[0].table[this.activePart.level][0], this.activePart.level);
    o[this.activePart.passives[0].boostKey] = +this.activePart.passives[0].table[this.activePart.level][1];
    return o;
  }

  get passive2Passed() {
    return this.activePart.passives[1].verifyCondition(this.ref.mappedConditionMap);
  }

  get passive2SkillEffect() {
    if (!this.activePart.passives || !this.activePart.passives[1].boostKey) {
      return {};
    }
    if (!this.passive2Passed) {
      return {};
    }
    const o = {};
    o[this.activePart.passives[1].boostKey] = +this.activePart.passives[1].table[this.activePart.level][1];
    return o;
  }

  get isEmpty() {
    return this.parts[0].isEmpty;
  }

  addWordTag(tag) {
    if (this.activeWordTags.length === 2) {
      this.activeWordTags.shift();
    }
    this.activeWordTags.push(tag);
  }

  toggleActivation() {
    if (this.activeSubposition === 0) {
      this.activeSubposition = 1;
    } else {
      this.activeSubposition = 0;
    }
  }

  get wordTags() {
    return [this.main.wordTag1, this.main.wordTag2, this.sub.wordTag1, this.sub.wordTag2].filter((d) => d !== '');
  }

  insert(part) {
    if (this.parts[0].isEmpty) {
      this.main = part;
      this.activeWordTags = [part.wordTag1, part.wordTag2];
    } else if (this.parts[1].isEmpty) {
      this.sub = part;
    } else if (this.activeSubposition === 0) {
      this.main = part;
    } else {
      this.sub = part;
    }
  }

  get main() {
    return this.parts[0];
  }

  get sub() {
    return this.parts[1];
  }

  set main(partConfig) {
    this.parts[0].updatePart(partConfig);
  }

  set sub(partConfig) {
    this.parts[1].updatePart(partConfig);
  }

  get activePart() {
    return this.parts[this.activeSubposition];
  }

  get boostAmount() {
    if (this.parts[0].isEmpty) {
      return 0;
    }
    return this.parts[this.activeSubposition].boostAmount;
  }

  get buffBoostAmount() {
    if (this.parts[0].isEmpty) {
      return 0;
    }
    return this.parts[this.activeSubposition].buffBoostAmount;
  }

  get activePassive1() {
    if (!this.activePart.passives || !this.activePart.passives[0]?.table) {
      return '';
    }
    return this.parts[this.activeSubposition].passive1.replace(/(\d+)([^0-9]+)$/, (_, __, c) => `${this.activePart.passives[0].table[this.activePart.level][1]}${c}`);
  }

  get activePassive2() {
    if (!this.activePart.passives || !this.activePart.passives[1]?.table) {
      return '';
    }
    return this.parts[this.activeSubposition].passive2.replace(/(\d+)([^0-9]+)$/, (_, __, c) => `${this.activePart.passives[1].table[this.activePart.level][1]}${c}`);
  }

  get meleeAttack() {
    return this.parts[0].meleeAttack + (this.parts[1].meleeAttack * this.parts[1].calculateSubBonus(this.parts[0]));
  }

  get rangeAttack() {
    return this.parts[0].rangeAttack + (this.parts[1].rangeAttack * this.parts[1].calculateSubBonus(this.parts[0]));
  }

  get meleeDefense() {
    return this.parts[0].meleeDefense + (this.parts[1].meleeDefense * this.parts[1].calculateSubBonus(this.parts[0]));
  }

  get rangeDefense() {
    return this.parts[0].rangeDefense + (this.parts[1].rangeDefense * this.parts[1].calculateSubBonus(this.parts[0]));
  }

  get physicalResistence() {
    return this.parts[0].physicalResistence + (this.parts[1].physicalResistence * this.parts[1].calculateSubBonus(this.parts[0]));
  }

  get beamResistence() {
    return this.parts[0].beamResistence + (this.parts[1].beamResistence * this.parts[1].calculateSubBonus(this.parts[0]));
  }

  get armor() {
    return this.parts[0].armor + (this.parts[1].armor * this.parts[1].calculateSubBonus(this.parts[0]));
  }

  removePart() {
    this.parts = [
      new Part(null, 'main'),
      new Part(null, 'sub'),
    ];
  }
}
