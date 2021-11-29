/* eslint-disable no-unused-vars */
import fs from 'fs';

const wikiFile = fs.readFileSync('public/wiki.json');
const machineFile = fs.readFileSync('public/machines.json');
const object1 = JSON.parse(wikiFile);
const object2 = JSON.parse(machineFile) || {};

object2.machines.forEach((machine) => {
  machine.parts.forEach((part) => {
    const [_1, name, _2, _3, comment] = part;
    if (comment.indexOf('＋') >= 0) {
      const position = comment.replace('＋', '');
      console.log(comment, position, name);
      const integratedPart = machine.parts.find((e) => e[0] === position);
      const integratedName = integratedPart ? integratedPart[1] : '';
      const partDetail = object1.wiki.find((p) => p.wikiUrl === name.wikiUrl);
      partDetail.integratedName = integratedName;
      partDetail.integrated = comment;
    }
  });
});

// eslint-disable-next-line vars-on-top
const json = JSON.stringify(object1);
fs.writeFile('public/wiki.json', json, 'utf8', () => {});
