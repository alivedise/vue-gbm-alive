import fs from 'fs';
import fetch from 'node-fetch';

let rawdata1 = fs.readFileSync('public/wiki.json');
let part = JSON.parse(rawdata1);

let rawdata2 = fs.readFileSync('public/machines.json');
let machine = JSON.parse(rawdata2);

async function cacheImage(src) {
  const s = `src/images/${src.split('/').reverse()[0]}`;
  if (!fs.existsSync(s)) {
    return fetch(src)
      .then(res =>
        res.body.pipe(
          fs.createWriteStream(s),
        ),
      ).catch((error) => {
        console.error(error);
      });
  } else {
    return Promise.resolve();
  }
}

await part.wiki.forEach((data) => {
  console.log(data.icon);
  return Promise.allSettled([cacheImage(data.icon), cacheImage(data.icon0)]);
});

await machine.machines.forEach((data) => {
  console.log(data.icon);
  return cacheImage(data.icon);
});

console.log('done');
