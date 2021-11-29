import Part from '@/models/Part';

export default class PartCombinator {
  constructor(position) {
    this.position = position;
    this.parts = [
      new Part(null, 'main'),
      new Part(null, 'sub'),
    ];
    this.activeSubposition = 0;
  }

  get isEmpty() {
    return this.parts[0].isEmpty;
  }

  insert(part) {
    if (this.parts[0].isEmpty) {
      this.main = part;
    } else if (this.parts[1].isEmpty) {
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

  get activePassive1() {
    return this.parts[this.activeSubposition].passive1;
  }

  get activePassive2() {
    return this.parts[this.activeSubposition].passive2;
  }

  get meleeAttack() {
    return this.parts[0].meleeAttack + this.parts[1].meleeAttack;
  }

  get rangeAttack() {
    return this.parts[0].rangeAttack + this.parts[1].rangeAttack;
  }

  get meleeDefense() {
    return this.parts[0].meleeDefense + this.parts[1].meleeDefense;
  }

  get rangeDefense() {
    return this.parts[0].rangeDefense + this.parts[1].rangeDefense;
  }

  get physicalResistence() {
    return this.parts[0].physicalResistence + this.parts[1].physicalResistence;
  }

  get beamResistence() {
    return this.parts[0].beamResistence + this.part[1].beamResistence;
  }

  get armor() {
    return this.parts[0].armor + this.parts[1].armor;
  }

  removePart() {
    this.parts = [
      new Part(null, 'main'),
      new Part(null, 'sub'),
    ];
  }
}
