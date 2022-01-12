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
    this.disabled = false; // for integrated part
  }

  installCondition(ref) {
    this.ref = ref;
  }

  disable() {
    this.disabled = true;
    this.main.reset();
    this.sub.reset();
  }

  enable() {
    this.disabled = false;
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
    if (this.activeWordTags.indexOf(tag) >= 0) {
      return;
    }
    this.activeWordTags.push(tag);
  }

  toggleActivation() {
    if (this.parts[0].isEmpty || this.parts[1].isEmpty) {
      return;
    }
    if (this.activeSubposition === 0) {
      this.activeSubposition = 1;
    } else {
      this.activeSubposition = 0;
    }
  }

  get wordTags() {
    return [...this.main.wordTags, ...this.sub.wordTags].filter((d) => d !== '');
  }

  get nextInsertingSubposition() {
    if (this.parts[0].isEmpty) {
      return 0;
    }
    if (this.parts[1].isEmpty) {
      return 1;
    }
    return this.activeSubposition;
  }
 
  insert(part, map) {
    const inserting = this.nextInsertingSubposition;
    this.map = map;
    if (inserting === 0) {
      this.main = part;
      if (this.sub.options.weaponType && this.main.options.weaponType) {
        if (this.sub.options.weaponType !== this.main.options.weaponType) {
          this.sub.reset();
        }
      }
    } else {
      this.sub = part;
    }
    this.resetActiveWordTags();
    if (!part.wordTag1 && !this.main.wordTag1) {
      return;
    }
    if (this.activeWordTags.length < 2) {
      this.addWordTag(part.wordTag1 || this.main.wordTag1);
    }
    if (this.activeWordTags.length < 2) {
      this.addWordTag(part.wordTag2 || this.main.wordTag2);
    }
  }

  resetActiveWordTags() {
    this.activeWordTags = this.activeWordTags.filter((tag) => this.wordTags.indexOf(tag) >= 0);
  }

  get main() {
    return this.parts[0];
  }

  get sub() {
    return this.parts[1];
  }

  set main(partConfig) {
    this.parts[0].updatePart(partConfig);
    if (partConfig.linked && partConfig.linked.length) {
      partConfig.linked.forEach((id) => {
        this.parts[0].link(this.map[id]);
      });
    }
  }

  set sub(partConfig) {
    this.parts[1].updatePart(partConfig);
    if (partConfig.linked && partConfig.linked.length) {
      partConfig.linked.forEach((id) => {
        this.parts[1].link(this.map[id]);
      });
    }
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
      return () => '';
    }
    return ($t) => {
      return $t(this.parts[this.activeSubposition].passive1).replace(/(\d+)([^0-9]+)$/, (_, __, c) => `${this.activePart.passives[0].table[this.activePart.level][1]}${c}`);
    }
  }

  get activePassive2() {
    if (!this.activePart.passives || !this.activePart.passives[1]?.table) {
      return () => '';
    }
    return ($t) => {
      return $t(this.parts[this.activeSubposition].passive2).replace(/(\d+)([^0-9]+)$/, (_, __, c) => `${this.activePart.passives[1].table[this.activePart.level][1]}${c}`);
    };
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
