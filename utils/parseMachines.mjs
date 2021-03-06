import parser from "node-html-parser";
import fetch from "node-fetch";
import fs from 'fs';
import findElementWithText from './findElementWithText.mjs';
import getMachineDetail from './parseMachineParts.mjs';
import parsePart from './parsePart.mjs';

const rawPart = fs.readFileSync('public/wiki.json');
const raw = fs.readFileSync('public/machines.json');
let original = JSON.parse(raw) || {
  machines: [],
};

let originalPart = JSON.parse(rawPart) || {
  wiki: [],
};

let partMapByWikiUrl = {};

originalPart.wiki.forEach((part) => {
  partMapByWikiUrl[part.wikiUrl] = part;
});

// reset isNew
original.machines.forEach((part) => {
  part.isNew = false;
});

const NEW_ONLY_MODE = true;

const NO_UPDATE = false;

const CATEGORY_URL = {
  machine: 'https://wiki.dengekionline.com/gbm/%E6%A9%9F%E4%BD%93%E4%B8%80%E8%A6%A7',
  machine_alter: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0%E6%A9%9F%E4%BD%93%E4%B8%80%E8%A6%A7',
};

async function test(url, category) {
  const isAltered = category.indexOf('alter') >= 0;
  return await fetch(url).then((response) =>
    response.text().then((responseHtml) => {
      // parse the HTML string into a DOM-like object we can navigate
      const document = parser.parse(responseHtml);
      let parts = [];
      let newParts = [];
      let addDate = '';
      let newNote = findElementWithText(document, 'h4 strong', 'NEW');
      let ancestor = newNote.parentNode.parentNode;
      addDate = ancestor.textContent.match(/\d+/ig).join('/');
      addDate = `${new Date().getFullYear()}/${addDate}`;
      newParts = Array.from(ancestor.nextElementSibling.querySelectorAll('td a'));
      if (!NEW_ONLY_MODE) {
        parts = Array.from(document.querySelectorAll('td a'));
      } else {
        parts = newParts;
      }
      const mappedParts = parts.map((part) => {
        if (newParts.indexOf(part) >= 0) {
          return {
            anchor: part,
            addDate,
          }
        } else {
          return {
            anchor: part,
            addDate: '',
          }
        }
      });
      mappedParts.reduce(function(cur, next) {
        return cur.then(function() {
          const url = `https://wiki.dengekionline.com${next.anchor.getAttribute('href')}`;
          return getMachineDetail(url, next.addDate, isAltered).then((data) => {
            const existed = original.machines.findIndex(r => r.wikiUrl === url);
            if (existed >= 0) {
              if (!NO_UPDATE) {
                original.machines[existed] = data; // update
              }
            } else {
              original.machines.push(data);
            }
            return Promise.all(data.parts.filter((p) => typeof(p[1]) === 'object' && p[1].wikiUrl && !partMapByWikiUrl[p[1].wikiUrl])
              .map((p) => parsePart(p[1].wikiUrl, '', isAltered).then((pData) => {
                if (!pData) {
                  console.error(p[1].wikiUrl);
                } else {
                  console.log(pData);
                }
                originalPart.wiki.push(pData);
              })));
          });
        });
      }, Promise.resolve()).then(function() {
        //all executed
        var json = JSON.stringify(original);
        fs.writeFile('public/machines.json', json, 'utf8', () => {});

        var json = JSON.stringify(originalPart);
        fs.writeFile('public/wiki.json', json, 'utf8', () => {});
      });
    })
  );
}

Object.entries(CATEGORY_URL).forEach(([k, v]) => {
  test(v, k);
});
