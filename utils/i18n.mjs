import fs from 'fs';

let rawdata = fs.readFileSync('wiki.json');
let original = fs.readFileSync('TradChinese.json');
let student = JSON.parse(rawdata);
let object = JSON.parse(original) || {};
console.log(student);

function inject(obj, key) {
  if (object[key] || !key) {
    return;
  }
  obj[key] = key;
}

student.wiki.forEach((data) => {
  inject(object, data.wordTag1);
  inject(object, data.wordTag2);
  inject(object, data.passive1);
  inject(object, data.passive2);
  inject(object, data.skillName);
  inject(object, data.skillDescription);
  inject(object, data.machineName);
  inject(object, data.position);
  inject(object, data.weaponAttackType);
  inject(object, data.weaponType);
  inject(object, data.aiName);
});

var json = JSON.stringify(object);
fs.writeFile('TradChinese.json', json, 'utf8', () => {});
