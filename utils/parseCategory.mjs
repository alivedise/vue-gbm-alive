import parser from "node-html-parser";
import fetch from "node-fetch";
import fs from 'fs';
import findElementWithText from './findElementWithText.mjs';
import getHtmlDocumentFromUrl from './parsePart.mjs';

const raw = fs.readFileSync('wiki.json');
let original = JSON.parse(raw) || {
  wiki: [],
};

// reset isNew
original.wiki.forEach((part) => {
  part.isNew = false;
});

const NEW_ONLY_MODE = false;

const CATEGORY_URL = {
  module: 'https://wiki.dengekionline.com/gbm/%E3%83%A2%E3%82%B8%E3%83%A5%E3%83%BC%E3%83%AB%EF%BC%88%E6%A0%BC%E9%97%98%EF%BC%89%E4%B8%80%E8%A6%A7',
  head: 'https://wiki.dengekionline.com/gbm/Head%EF%BC%88%E9%A0%AD%EF%BC%89%E4%B8%80%E8%A6%A7',
  arm: 'https://wiki.dengekionline.com/gbm/Arms%EF%BC%88%E8%85%95%EF%BC%89%E4%B8%80%E8%A6%A7',
  leg: 'https://wiki.dengekionline.com/gbm/Legs%EF%BC%88%E8%84%9A%E9%83%A8%EF%BC%89%E4%B8%80%E8%A6%A7',
  chest: 'https://wiki.dengekionline.com/gbm/Body%EF%BC%88%E8%83%B4%E4%BD%93%EF%BC%89%E4%B8%80%E8%A6%A7',
  back: 'https://wiki.dengekionline.com/gbm/Back%EF%BC%88%E8%83%8C%E4%B8%AD%EF%BC%89%E4%B8%80%E8%A6%A7',
  shield: 'https://wiki.dengekionline.com/gbm/Shield%EF%BC%88%E7%9B%BE%EF%BC%89%E4%B8%80%E8%A6%A7',
  ai: 'https://wiki.dengekionline.com/gbm/AI%EF%BC%88%E3%83%91%E3%82%A4%E3%83%AD%E3%83%83%E3%83%88%EF%BC%89%E4%B8%80%E8%A6%A7',
  saber: 'https://wiki.dengekionline.com/gbm/%E3%82%B5%E3%83%BC%E3%83%99%E3%83%AB%EF%BC%88%E6%A0%BC%E9%97%98%EF%BC%89%E4%B8%80%E8%A6%A7',
  doublesaber: 'https://wiki.dengekionline.com/gbm/%E3%83%80%E3%83%96%E3%83%AB%E3%82%B5%E3%83%BC%E3%83%99%E3%83%AB%EF%BC%88%E6%A0%BC%E9%97%98%EF%BC%89%E4%B8%80%E8%A6%A7',
  axe: 'https://wiki.dengekionline.com/gbm/%E3%82%A2%E3%83%83%E3%82%AF%E3%82%B9%EF%BC%88%E6%A0%BC%E9%97%98%EF%BC%89%E4%B8%80%E8%A6%A7',
  bigsword: 'https://wiki.dengekionline.com/gbm/%E5%A4%A7%E5%89%A3%EF%BC%88%E6%A0%BC%E9%97%98%EF%BC%89%E4%B8%80%E8%A6%A7',
  lance: 'https://wiki.dengekionline.com/gbm/%E3%83%A9%E3%83%B3%E3%82%B9%EF%BC%88%E6%A0%BC%E9%97%98%EF%BC%89%E4%B8%80%E8%A6%A7',
  whip: 'https://wiki.dengekionline.com/gbm/%E3%83%A0%E3%83%81%EF%BC%88%E6%A0%BC%E9%97%98%EF%BC%89%E4%B8%80%E8%A6%A7',
  twinblade: 'https://wiki.dengekionline.com/gbm/%E3%83%84%E3%82%A4%E3%83%B3%E3%83%96%E3%83%AC%E3%83%BC%E3%83%89%EF%BC%88%E6%A0%BC%E9%97%98%EF%BC%89%E4%B8%80%E8%A6%A7',
  rifle: 'https://wiki.dengekionline.com/gbm/%E3%83%A9%E3%82%A4%E3%83%95%E3%83%AB%EF%BC%88%E5%B0%84%E6%92%83%EF%BC%89%E4%B8%80%E8%A6%A7',
  longrifle: 'https://wiki.dengekionline.com/gbm/%E3%83%AD%E3%83%B3%E3%82%B0%E3%83%A9%E3%82%A4%E3%83%95%E3%83%AB%EF%BC%88%E5%B0%84%E6%92%83%EF%BC%89%E4%B8%80%E8%A6%A7',
  doublerifle: 'https://wiki.dengekionline.com/gbm/%E3%83%80%E3%83%96%E3%83%AB%E3%83%A9%E3%82%A4%E3%83%95%E3%83%AB%EF%BC%88%E5%B0%84%E6%92%83%EF%BC%89%E4%B8%80%E8%A6%A7',
  machinegun: 'https://wiki.dengekionline.com/gbm/%E3%83%9E%E3%82%B7%E3%83%B3%E3%82%AC%E3%83%B3%EF%BC%88%E5%B0%84%E6%92%83%EF%BC%89%E4%B8%80%E8%A6%A7',
  bazooka: 'https://wiki.dengekionline.com/gbm/%E3%83%90%E3%82%BA%E3%83%BC%E3%82%AB%EF%BC%88%E5%B0%84%E6%92%83%EF%BC%89%E4%B8%80%E8%A6%A7',
  gatlinggun: 'https://wiki.dengekionline.com/gbm/%E3%82%AC%E3%83%88%E3%83%AA%E3%83%B3%E3%82%B0%E3%82%AC%E3%83%B3%EF%BC%88%E5%B0%84%E6%92%83%EF%BC%89%E4%B8%80%E8%A6%A7',

  head_alter: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0Head%EF%BC%88%E9%A0%AD%EF%BC%89%E4%B8%80%E8%A6%A7',
  chest_alter: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0Body%EF%BC%88%E8%83%B4%E4%BD%93%EF%BC%89%E4%B8%80%E8%A6%A7',
  arm_alter: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0Arms%EF%BC%88%E8%85%95%EF%BC%89%E4%B8%80%E8%A6%A7',
  leg_alter: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0Legs%EF%BC%88%E8%84%9A%E9%83%A8%EF%BC%89%E4%B8%80%E8%A6%A7',
  back_alter: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0Back%EF%BC%88%E8%83%8C%E4%B8%AD%EF%BC%89%E4%B8%80%E8%A6%A7',
  shield_alter: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0Shield%EF%BC%88%E7%9B%BE%EF%BC%89%E4%B8%80%E8%A6%A7',
  saber_alter: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0%E3%82%B5%E3%83%BC%E3%83%99%E3%83%AB%EF%BC%88%E6%A0%BC%E9%97%98%EF%BC%89%E4%B8%80%E8%A6%A7',
  doublesaber_alter: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0%E3%83%80%E3%83%96%E3%83%AB%E3%82%B5%E3%83%BC%E3%83%99%E3%83%AB%EF%BC%88%E6%A0%BC%E9%97%98%EF%BC%89%E4%B8%80%E8%A6%A7',
  axe_alter: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0%E3%82%A2%E3%83%83%E3%82%AF%E3%82%B9%EF%BC%88%E6%A0%BC%E9%97%98%EF%BC%89%E4%B8%80%E8%A6%A7',
  bigsword_alter: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0%E5%A4%A7%E5%89%A3%EF%BC%88%E6%A0%BC%E9%97%98%EF%BC%89%E4%B8%80%E8%A6%A7',
  lance_alter: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0%E3%83%A9%E3%83%B3%E3%82%B9%EF%BC%88%E6%A0%BC%E9%97%98%EF%BC%89%E4%B8%80%E8%A6%A7',
  whip_alter: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0%E3%83%A0%E3%83%81%EF%BC%88%E6%A0%BC%E9%97%98%EF%BC%89%E4%B8%80%E8%A6%A7',
  twinblade_alter: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0%E3%83%84%E3%82%A4%E3%83%B3%E3%83%96%E3%83%AC%E3%83%BC%E3%83%89%EF%BC%88%E6%A0%BC%E9%97%98%EF%BC%89%E4%B8%80%E8%A6%A7',
  rifle_alter: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0%E3%83%A9%E3%82%A4%E3%83%95%E3%83%AB%EF%BC%88%E5%B0%84%E6%92%83%EF%BC%89%E4%B8%80%E8%A6%A7',
  longrifle_alter: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0%E3%83%AD%E3%83%B3%E3%82%B0%E3%83%A9%E3%82%A4%E3%83%95%E3%83%AB%EF%BC%88%E5%B0%84%E6%92%83%EF%BC%89%E4%B8%80%E8%A6%A7',
  doublerifle_alter: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0%E3%83%80%E3%83%96%E3%83%AB%E3%83%A9%E3%82%A4%E3%83%95%E3%83%AB%EF%BC%88%E5%B0%84%E6%92%83%EF%BC%89%E4%B8%80%E8%A6%A7',
  machinegun_alter: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0%E3%83%9E%E3%82%B7%E3%83%B3%E3%82%AC%E3%83%B3%EF%BC%88%E5%B0%84%E6%92%83%EF%BC%89%E4%B8%80%E8%A6%A7',
  bazooka_alter: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0%E3%83%90%E3%82%BA%E3%83%BC%E3%82%AB%EF%BC%88%E5%B0%84%E6%92%83%EF%BC%89%E4%B8%80%E8%A6%A7',
  gatlinggun_alter: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0%E3%82%AC%E3%83%88%E3%83%AA%E3%83%B3%E3%82%B0%E3%82%AC%E3%83%B3%EF%BC%88%E5%B0%84%E6%92%83%EF%BC%89%E4%B8%80%E8%A6%A7',
  ai_alter: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0AI%EF%BC%88%E3%83%91%E3%82%A4%E3%83%AD%E3%83%83%E3%83%88%EF%BC%89%E4%B8%80%E8%A6%A7',
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
      parts.forEach(() => {

      });
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
          return getHtmlDocumentFromUrl(url, next.addDate, isAltered).then((data) => {
            const existed = original.wiki.findIndex(r => r.wikiUrl === url);
            if (existed >= 0) {
              original.wiki[existed] = data; // update
            } else {
              original.wiki.push(data);
            }
          });
        });
      }, Promise.resolve()).then(function() {
        //all executed
        var json = JSON.stringify(original);
        fs.writeFile('wiki.json', json, 'utf8', () => {});
      });
    })
  );
}

Object.entries(CATEGORY_URL).forEach(([k, v]) => {
  test(v, k);
});