import fs from 'fs';

let rawdata = fs.readFileSync('wiki.json');
let student = JSON.parse(rawdata);
console.log(student);
const object = {};

function extractEffectAmount(string, table) {
  let dict = {};
  if (!table || !table.length || !table[0].indexOf('効果値') < 0) {
    dict[string] = string;
    return dict;
  }
  let level1Value = table[1][table[0].indexOf('効果値')];
  let count = 1;
  if (level1Value.indexOf('/') >= 0) {
    count = 2;
  }
  let key = string.replace(/(\d+)(\D*)$/, '$2');
  let value = string.replace(/(\d+)(\D*)$/, '{a}');
  if (count === 2) {
    key = key.replace(/(\d+)(\D*)$/, '$2');
    value = value.replace(/(\d+)(\D*)$/, '{b}');
  }
  dict[key] = value;
  return dict;
}

student.wiki.forEach((data) => {
  object[data.wordTag1] = data.wordTag1;
  object[data.wordTag2] = data.wordTag2;
  if (data.passive1) {
    let dict = extractEffectAmount(data.passive1, data.passive1Table);
    Object.entries(dict).forEach(([k, v]) => {
      object[k] = v;
    });
  }
  if (data.passive2) {
    object[data.passive2] = data.passive2;
  }
  if (data.skillName) {
    object[data.skillName] = data.skillName;
  }
  if (data.skillDescription) {
    object[data.skillDescription] = data.skillDescription;
  }
  object[data.machineName] = data.machineName;
  object[data.position] = data.position;
  if (data.weaponType) {
    object[data.weaponType] = data.weaponType;
  }
  if (data.weaponAttackType) {
    object[data.weaponType] = data.weaponType;
  }
  if (data.aiName) {
    object[data.aiName] = data.aiName;
  }
});

var json = JSON.stringify(object);
fs.writeFile('Japanese.json', json, 'utf8', () => {});
