import fs from 'fs';

let original = fs.readFileSync('src/i18n/languages/TradChinese.json');
let object = JSON.parse(original) || {};

Object.entries(object).forEach(([k, v]) => {
  object[k] = v
    .replace(/％/ig, '%')
    .replace(/可変/ig, '可變')
    .replace(/主人公機/ig, '主角機')
    .replace(/ガンダムタイプ/ig, '鋼彈')
    .replace(/接近戦/ig, '近身戰')
    .replace(/中距離戦/ig, '中距離')
    .replace(/遠距離戦/ig, '遠距離')
    .replace(/宇宙適正/ig, '宇宙適性')
    .replace(/エース専用機/ig, '王牌專用機')
    .replace(/カテゴリ装備時/ig, '種類裝備時')
    .replace(/モビルファイター/ig, 'MF')
    .replace(/市街地適正/ig, '市區適性')
    .replace(/森林適正/ig, '森林適性')
    .replace(/連邦/ig, '聯邦')
    .replace(/ジムタイプ/ig, '吉姆')
    .replace(/基地適正/ig, '基地適性')
    .replace(/宇宙適正/ig, '宇宙適性')
    .replace(/電脳適正/ig, '電腦適性')
    .replace(/ジオン/ig, '吉翁')
    .replace(/砂漠適正/ig, '沙漠適性')
    .replace(/寒冷地適正/ig, '寒地適性')
    .replace(/水陸両用/ig, '水陸兩用')
    .replace(/自機の属性がTechniqueの時/ig, 'T屬時')
    .replace(/自機の属性がPowerの時/ig, 'P屬時')
    .replace(/自機の属性がSpeedの時/ig, 'S屬時')
    .replace(/EXskillの威力/ig, 'EX威力')
    .replace(/EXskillのクールタイム/ig, 'EX冷卻')
    .replace(/クールタイムが?/ig, 'EX冷卻')
    .replace(/EXskillの回復量/ig, 'EX補量')
    .replace(/強化EXskillの?効果/ig, '強化EX效果')
    .replace(/弱体化EXskillの?効果/ig, '弱化EX效果')
    .replace(/敵全機のクールタイムを/ig, '敵全體冷卻')
    .replace(/の与ダメージ/ig, '予傷')
    .replace(/%遅延/ig, '%增加')
    .replace(/距離射撃攻撃の威力/ig, '距離射擊威力')
    .replace(/ジョブゲージ増加量/ig, '職業氣條增加量')
    .replace(/物理タイプの攻撃/ig, '物理攻擊')
    .replace(/物理タイプ射撃武器の/ig, '物理射擊武器')
    .replace(/ビームタイプ射撃武器の/ig, '光束射擊武器')
    .replace(/ビームタイプの攻撃/ig, '光束攻擊')
    .replace(/格闘攻撃の威力(が)?/ig, '格鬥攻擊')
    .replace(/^射擊威力(が)?/ig, '射擊攻擊')
    .replace(/^格闘威力(が)?/ig, '格鬥攻擊')
    .replace(/射擊攻撃の威力(が)?/ig, '射擊攻擊')
    .replace(/敵機との属性相性が不利の時/ig, '被剋屬時')
    .replace(/敵機との属性相性が有利の時/ig, '剋屬時')
    .replace(/敵機との属性相性が普通の時/ig, '敵同屬時')
    .replace(/マルチミッション出撃時/ig, '多人任務時')
    .replace(/小隊に全属性が揃っている時/ig, '小隊全屬時')
    .replace(/小隊3機全てがSpeedの?時/ig, '小隊皆S屬')
    .replace(/小隊3機全てがTechniqueの?時/ig, '小隊皆T屬')
    .replace(/小隊3機全てがPowerの?時/ig, '小隊皆P屬')
    .replace(/^ダブルサーベル/ig, '雙刀')
    .replace(/^サーベル/ig, '軍刀')
    .replace(/^アックス/ig, '斧')
    .replace(/^大剣/ig, '大劍')
    .replace(/^ランス/ig, '長槍')
    .replace(/^モジュール/ig, '模組')
    .replace(/^ムチ/ig, '鞭')
    .replace(/^ツインブレード/ig, '雙頭刃')
    .replace(/^ロングライフル/ig, '長槍')
    .replace(/^ダブルライフル/ig, '雙槍')
    .replace(/^ライフル/ig, '步槍')
    .replace(/^マシンガン/ig, '機槍')
    .replace(/^バズーカ/ig, '火箭筒')
    .replace(/^ガトリングガン/ig, '格林機槍')
    .replace(/味方機が1体撃墜された時/ig, '僚機被擊墜1體時')
    .replace(/の確率で致死攻撃を耐える/ig, '機率免死')
    .replace(/攻撃がスーパーアーマーを貫通/ig, '攻擊貫通超級裝甲')
    .replace(/機率で/ig, '機率')
    .replace(/アリーナ出撃時/ig, '競技場時')
    .replace(/^ジョブが/ig, '')
    .replace(/自機が強化状態の時/ig, '強化時')
    .replace(/》の時/ig, '》時')
    .replace(/EXskill初期チャージ量/ig, 'EX初充')
    .replace(/ミッション開始から/ig, '任務開始')
    .replace(/一度だけ/ig, '僅限一次')
    .replace(/ジョブゲージが/ig, '職業氣條')
    .replace(/以上の時/ig, '以上時')
    .replace(/減少し/ig, '減少')
    .replace(/射擊威力が/ig, '射擊威力')
    .replace(/の時/ig, '時')
    .replace(/敵機を(\d+)体撃墜した/ig, (x, b, c) => `敵${b}體擊墜時`)
    .replace(/格闘攻撃力が(\d+)以/ig, (x, b, c) => `格攻${b}以`)
    .replace(/射擊攻撃力が(\d+)以/ig, (x, b, c) => `射攻${b}以`)
    .replace(/戦闘力が(\d+)以/ig, (x, b, c) => `戰力${b}以`)
    .replace(/物理耐性が(\d+)以/ig, (x, b, c) => `物耐${b}以`)
    .replace(/ビーム耐性が(\d+)以/ig, (x, b, c) => `光耐${b}以`)
    .replace(/耐久力が(\d+)以/ig, (x, b, c) => `耐久${b}以`)
    .replace(/^耐久力が/ig, '耐久')
    .replace(/射撃防御力が(\d+)以/ig, (x, b, c) => `射防${b}以`)
    .replace(/格闘防御力が(\d+)以/ig, (x, b, c) => `格防${b}以`)
    .replace(/耐久力が徐々に(\d+)ずつ/ig, (x, b, c) => `耐久慢慢以${b}`)
    .replace(/以上の時/ig, '以上時')
    .replace(/以下の時/ig, '以下時')
    .replace(/減少し/ig, '減少')
    .replace(/敵の/, '敵')
    .replace(/(の)?会心率/ig, '爆擊率')
    .replace(/全攻撃の威力/ig, '全攻撃威力')
    .replace(/バーニアの回復速度が/ig, '推進器回復速度')
    .replace(/自機が《/ig, '自機《')
    .replace(/射撃の誘導性能/ig, '射擊誘導')
    .replace(/射撃の弾速/ig, '射速')
    .replace(/速度が/ig, '速度')
    .replace(/reload速度/ig, '裝填速度')
    .replace(/背中パーツの?/ig, '背部零件')
    .replace(/^背中/ig, '背部')
    .replace(/胴体パーツの?/ig, '胸部零件')
    .replace(/^胴体/ig, '胸部')
    .replace(/盾パーツの?/ig, '盾牌零件')
    .replace(/腕パーツの?/ig, '手部零件')
    .replace(/頭パーツの?/ig, '頭部零件')
    .replace(/脚部パーツの?/ig, '腳部零件')
    .replace(/^脚部/ig, '腳部')
    .replace(/パーツの/ig, '零件')
    .replace(/近接武器の/ig, '格鬥武器')
    .replace(/射擊武器の/ig, '射擊武器')
    .replace(/自動で操作されている時/ig, '自動操作時')
    .replace(/射撃攻撃力が/ig, '射攻')
    .replace(/格闘攻撃力が/ig, '格攻')
    .replace(/射撃攻撃の威力が?/ig, '射擊攻擊')
    .replace(/敵機との属性相性が有利の?時/ig, '剋屬時')
    .replace(/敵機との属性相性が普通の?時/ig, '敵同屬時')
    .replace(/敵機との属性相性が不利の?時/ig, '被剋時')
    .replace(/ビーム・?サーベル/ig, '光束軍刀')
    .replace(/ビーム・?ライフル/ig, '光束步槍')
    .replace(/シールド［/ig, '盾牌［')
    .replace(/メイス［/ig, '鎚矛［')
    .replace(/ザク・?マシンガン/ig, '薩克機關槍')
    .replace(/ハイパー・?バズーカ/ig, '超絕火箭砲')
    .replace(/GNバズーカ/ig, 'GN火箭炮')
    .replace(/対ビーム/ig, '對光束')
    .replace(/部部/ig, '部')
    .replace(/EXskill攻撃を受けた後/ig, '受EX攻擊後')
    .replace(/［リボーンズ］/ig, '［再生］')
    .replace(/［再生鋼彈］/ig, '［再生］')
    .replace(/［ヘリオス］/ig, '［太陽神］')
    .replace(/［太陽神鋼彈］/ig, '［太陽神］')
    .replace(/［ユニコーン/ig, '［獨角獸')
    .replace(/［アリオス］/ig, '［墮天使］')
    .replace(/［アストレア/ig, '［正義女神')
    .replace(/［フルアーマー/ig, '［全裝甲')
    .replace(/［デスティニー/ig, '［命運')
    .replace(/高エネルギー/ig, '高能')
    .replace(/アームド・アーマー/ig, '武裝戰甲')
    .replace(/ハイパー・/ig, '超絕')
    .replace(/［(.+)］/ig, (x, b, c) => {
      if (object[b] && object[b] !== b) {
        return `［${object[b]}］`
      } else if (object[`${b}ガンダム`]) {
        return `［${object[`${b}ガンダム`].replace('鋼彈', '')}］`
      } else if (object[`ガンダム${b}`]) {
        return `［${object[`ガンダム${b}`].replace('鋼彈', '')}］`
      }
      return `［${b}］`;
    })
    .replace(/［(.+)／/ig, (x, b, c) => {
      if (object[b] && object[b] !== b) {
        return `［${object[b]}／`
      } else if (object[`${b}ガンダム`]) {
        return `［${object[`${b}ガンダム`].replace('鋼彈', '')}／`
      } else if (object[`ガンダム${b}`]) {
        return `［${object[`ガンダム${b}`].replace('鋼彈', '')}／`
      }
      return `［${b}／`;
    })
    .replace(/［(.+)（/ig, (x, b, c) => {
      if (object[b] && object[b] !== b) {
        return `［${object[b]}（`
      } else if (object[`${b}ガンダム`]) {
        return `［${object[`${b}ガンダム`].replace('鋼彈', '')}（`
      } else if (object[`ガンダム${b}`]) {
        return `［${object[`ガンダム${b}`].replace('鋼彈', '')}（`
      }
      return `［${b}（`;
    })
    .replace(/［ターンレッド］/ig, '［逆紅］')
    .replace(/［エピオン/ig, '［次代')
    .replace(/ラミネートアンチビーム/ig, '積層反光束')
    .replace(/［ナラティブ/ig, '［敘事')
    .replace(/［ゲルググ/ig, '［傑爾古格')
    .replace(/ビーム・?ランス/ig, '光束長槍')
    .replace(/GNソード/ig, 'GN劍')
    .replace(/イノベイター/ig, '變革者')
    .replace(/敵敵/ig, '敵');
});

var json = JSON.stringify(object);
fs.writeFile('src/i18n/languages/TradChinese.json', json, 'utf8', () => {});
