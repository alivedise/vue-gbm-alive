import * as fs from 'fs';
import * as csv from 'fast-csv';

let original = fs.readFileSync('src/i18n/languages/TradChinese.json');
let object = JSON.parse(original) || {};

fs.createReadStream('test.csv')
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', row => {
      const jp = row['日文'];
      const tw = row['中文'];
      if (jp === tw) {
        return;
      }
      if (object[jp] !== jp) {
        return;
      }
      object[jp] = tw;
    })
    .on('end', (rowCount) => {
      console.log(`Parsed ${rowCount} rows`);
      var json = JSON.stringify(object);
      fs.writeFile('TradChinese.json', json, 'utf8', () => {});
    });