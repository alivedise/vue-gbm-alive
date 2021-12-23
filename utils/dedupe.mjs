import fs from 'fs';

const raw = fs.readFileSync('public/wiki.json');
let original = JSON.parse(raw) || {
  wiki: [],
};

const dupe = {};

// reset isNew
const wiki = original.wiki.filter((part) => {
  if (part === null) {
    return false;
  }
  if (dupe[part.wikiUrl]) {
    console.log(part.position, part.machineName);
    return false;
  }
  dupe[part.wikiUrl] = true;
  return true;
});

original.wiki = wiki;

var json = JSON.stringify(original);
fs.writeFile('public/wiki.json', json, 'utf8', () => {});
