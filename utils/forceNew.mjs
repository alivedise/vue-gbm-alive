import fs from 'fs';

const raw = fs.readFileSync('public/wiki.json');
let original = JSON.parse(raw) || {
  wiki: [],
};

// reset isNew
original.wiki.forEach((part) => {
  if (part.addDate.indexOf('2022') >= 0) {
    part.addDate = part.addDate.replace('2022', '2021');
  }
});

var json = JSON.stringify(original);
fs.writeFile('public/wiki.json', json, 'utf8', () => {});
