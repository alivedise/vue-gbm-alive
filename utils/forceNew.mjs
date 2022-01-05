import fs from 'fs';

const raw = fs.readFileSync('public/wiki.json');
let original = JSON.parse(raw) || {
  wiki: [],
};

let year2022 = true;

// reset isNew
original.wiki.forEach((part) => {
  if (part.addDate === '2021/12/29') {
    year2022 = true;
  }
  if (part.isNew) {
    if (!year2022) {
      part.isNew = false;
    }
  }
});

var json = JSON.stringify(original);
fs.writeFile('public/wiki.json', json, 'utf8', () => {});
