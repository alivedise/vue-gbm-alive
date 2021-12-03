import fs from 'fs';

let rawdata = fs.readFileSync('public/wiki.json');
let wiki = JSON.parse(rawdata);

// run passives
wiki.wiki.forEach((data) => {
  delete data.specialBoost;
  delete data.initialChange;
  // doost
  const reg1 = /威力(\d+)?％上昇/ig;
  const reg2 = /威力(\d+)?％上昇/ig;
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

  if (/EXskill初期チャージ量(\d+)?％上昇/ig.exec(data.passive1) || /EXskill初期チャージ量(\d+)?％上昇/ig.exec(data.passive2)) {
    data.initialCharge = true;
  }
  // 一度だけ
  if (/クールタイムが?(\d+)?％減/ig.exec(data.passive1) || /クールタイムが?(\d+)?％減/ig.exec(data.passive2)) {
    data.cooldownReduction = true;
    if (/一度だけ/ig.exec(data.passive1) || /一度だけ/ig.exec(data.passive2)) {
      data.oneTimeCooldownReduction = true;
    }
  }
});

var json = JSON.stringify(wiki);
fs.writeFile('public/wiki.json', json, 'utf8', () => {});
