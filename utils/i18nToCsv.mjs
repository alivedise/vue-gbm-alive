import fs from 'fs';
import ObjectsToCsv from 'objects-to-csv';

let original = fs.readFileSync('src/i18n/languages/TradChinese.json');
let object = JSON.parse(original) || {};

function inject(obj, key) {
  if (object[key] || !key) {
    return;
  }
  obj[key] = key;
}

const data = [];

Object.entries(object).forEach(([k, v]) => {
  data.push({
    k,
    v,
  });
});

(async () => {
  const csv = new ObjectsToCsv(data);
 
  // Save to file:
  await csv.toDisk('./test.csv');
 
  // Return the CSV file as string:
  console.log(await csv.toString());
})();
