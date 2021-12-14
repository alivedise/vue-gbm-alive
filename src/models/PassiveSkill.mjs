export default class PassiveSkill {
  constructor(description, table) {
    this.description = description;
    this.table = table;
    this.$skillBoost = 0;
    this.$shootBoost = 0;
    this.$meleeBoost = 0;
    this.$effectBoost = 0;
    this.$condition = 0;
    this.$conditionType = '';
    if (this.parse()) {
      this.parseCondition();
    }
  }

  parseCondition() {
    const attr = /属性が(Speed|Technique|Power)/ig.exec(this.description);
    if (attr) {
      this.$condition = attr[1];
      this.$conditionType = 'attribute';
      return;
    }
    const tag = /《(.+)》/ig.exec(this.description);
    if (tag) {
      this.$condition = tag[1];
      this.$conditionType = 'tag';
      return;
    }
    const buff = /強化状態の時/ig.exec(this.description);
    if (buff) {
      this.$condition = 'buff';
      this.$conditionType = 'buff';
      return;
    }
    const type = /(ビーム|物理)タイプの攻撃/ig.exec(this.description);
    if (type) {
      this.$condition = type[1];
      this.$conditionType = 'type';
      return;
    }
    const job = /ジョブが(.*)の時/ig.exec(this.description);
    if (job) {
      this.$condition = job[1];
      this.$conditionType = 'job';
      return;
    }
    const category = /(.*)カテゴリ装備/ig.exec(this.description);
    if (category) {
      this.$condition = category[1];
      this.$conditionType = 'category';
      return;
    }
    const env = /(.*)出撃時/ig.exec(this.description);
    if (env) {
      this.$conditionType = env[1];
      this.$condition = 'environment';
      return;
    }
    const armor = /耐久力が(\d+)％以下/ig.exec(this.description);
    if (armor) {
      this.$condition = armor[1];
      this.$conditionType = 'armor';
      return;
    }
    const team = /小隊(.*)時/ig.exec(this.description);
    if (team) {
      this.$condition = team[1];
      this.$conditionType = 'team';
      return;
    }
    this.$condition = '';
    this.$conditionType = 'misc';
    return;
  }

  parse() {
    const skill = /EXskillの威力(\d+)?％上昇/ig.exec(this.description);
    if (skill) {
      if (/(腕|背中|頭|脚部|盾|近接武器|射撃武器|格闘武器|胴体)パーツのEXskillの威力/.exec(this.description)) {
        return false;
      }
      this.$skillBoost = true;
      return true;
    }
    const shot = /射撃攻撃の威力(\d+)?％上昇/ig.exec(this.description);
    if (shot) {
      if (/距離射撃攻撃の威力(\d+)?％上昇/ig.exec(this.description)) {
        return false;
      }
      this.$shootBoost = true;
      return true;
    }
    const melee = /格闘攻撃の威力(\d+)?％上昇/ig.exec(this.description);
    if (melee) {
      this.$meleeBoost = true;
      return true;
    }
    const effect = /強化EXskillの効果(\d+)％上昇/ig.exec(this.description);
    if (effect) {
      this.$effectBoost = true;
      return true;
    }
    return false;
  }

  get roughBoost() {
    return this.$skillBoost + this.$meleeBoost + this.$shootBoost;
  }

  get buffBoost() {
    return this.$effectBoost;
  }

  get boostKey() {
    if (this.$skillBoost) {
      return 'exBoost';
    }
    if (this.$meleeBoost) {
      return 'meleeBoost';
    }
    if (this.$shootBoost) {
      return 'rangeBoost';
    }
    if (this.$effectBoost) {
      return 'effectBoost';
    }
    return '';
  }
}

/*
  const reg1 = ig;
  const reg2 = 
  const rega = /強化EXskillの効果(\d+)％上昇/ig;
  const regb = /強化EXskillの効果(\d+)％上昇/ig;
  if ((reg1.exec(data.passive1) || rega.exec(data.passive1)) && (reg2.exec(data.passive2) || regb.exec(data.passive2))) {
    if ([data.passive1, data.passive2].every((p) => {
      const spart = /(腕|背中|頭|脚部|盾|近接武器|射撃武器|格闘武器|胴体)パーツのEXskillの威力/.exec(p);
      if (spart) {
        data.specificBoost = spart[1];
      }
      return (['EXskillの威力', '射撃攻撃の威力', '格闘攻撃の威力', '強化EXskillの効果'].some((f) => p.indexOf(f) >= 0))
        && !(/距離射撃攻撃の威力(\d+)?％上昇/ig.exec(p));
    })) {
      data.doubleBoost = true;
    } else {
      data.doubleBoost = false;
    }
  } else {
    data.doubleBoost = false;
  }
*/