import CATEGORY from '@/constants/CONDITION_CATEGORY_DATA.json';

const categoryList = Array.from(Object.values(CATEGORY));

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
    this.parse();
    this.parseCondition();
  }

  verifyCondition(env) {
    switch (this.$conditionType) {
      case 'attribute':
        return this.$condition === env.attribute;
      case 'tag':
        return env.wordTags.indexOf(this.$condition) >= 0;
      case 'type':
        return this.$condition === env.type;
      case 'job':
        return env.job === this.$condition;
      case 'short_weapon':
        return env.short_weapon === this.$condition;
      case 'long_weapon':
        return env.long_weapon === this.$condition;
      case 'buff':
        return env.buff === this.$condition;
      case 'team':
        return env.team === this.$condition;
      case 'counter':
        return env.counter === this.$condition;
      case 'misc':
        return true;
      default:
        return false;
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
      this.$condition = '強化状態';
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
      this.$conditionType = categoryList.find((v) => v.text === this.$condition)?.subCategory;
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
    const counter = /敵機との属性相性が(.*)の時/ig.exec(this.description);
    if (counter) {
      this.$condition = counter[1];
      this.$conditionType = 'counter';
      return;
    }
    const operate = /自動で操作されている時/ig.exec(this.description);
    if (operate) {
      this.$condition = '自動操作時';
      this.$conditionType = 'operate';
      return;
    }
    this.$condition = '';
    this.$conditionType = 'misc';
    return;
  }

  parse() {
    const icd = /EXskill初期チャージ量(\d+)?％上昇/ig.exec(this.description);
    if (icd) {
      this.$initialCharge = true;
      return true;
    }
    const cdr = /クールタイムが?(\d+)?％減/ig.exec(this.description);
    if (cdr) {
      if (/一度だけ/ig.exec(this.description)) {
        // do not count for one time here
        return false;
      }
      this.$cooldownReduction = true;
      return true;
    }
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
    if (this.$initialCharge) {
      return 'initialCharge';
    }
    if (this.$cooldownReduction) {
      return 'cooldownReduction';
    }
    return '';
  }
}
