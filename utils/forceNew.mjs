import fs from 'fs';

const raw = fs.readFileSync('wiki.json');
let original = JSON.parse(raw) || {
  wiki: [],
};

// reset isNew
original.wiki.forEach((part) => {
  part.isNew = false;
  if (part.machineName.indexOf('ガンダムバルバタウロス') >= 0 ||
      part.machineName.indexOf('ガンダムダブルオーコマンドクアンタ') >= 0 ||
      part.machineName.indexOf('RX-78-2 ガンダム［ENTRY GRADE／フルウェポンセット］') >= 0
  ) {
    part.isNew = true;
  }
});

var json = JSON.stringify(original);
fs.writeFile('wiki.json', json, 'utf8', () => {});
