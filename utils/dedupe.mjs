import fs from 'fs';

const raw = fs.readFileSync('wiki.json');
let original = JSON.parse(raw) || {
  wiki: [],
};

const dupe = {};

// reset isNew
const wiki = original.wiki.filter((part) => {
  if (dupe[part.wikiUrl]) {
    console.log(part.position, part.machineName);
    return false;
  }
  dupe[part.wikiUrl] = true;
  return true;
});

original.wiki = wiki;

var json = JSON.stringify(original);
fs.writeFile('wiki.json', json, 'utf8', () => {});
