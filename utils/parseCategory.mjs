import parser from "node-html-parser";
import fetch from "node-fetch";
import fs from 'fs';
import getHtmlDocumentFromUrl from './parsePart.mjs';

const CATEGORY_URL = {
  module: 'https://wiki.dengekionline.com/gbm/%E3%83%A2%E3%82%B8%E3%83%A5%E3%83%BC%E3%83%AB%EF%BC%88%E6%A0%BC%E9%97%98%EF%BC%89%E4%B8%80%E8%A6%A7',
  head: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0Head%EF%BC%88%E9%A0%AD%EF%BC%89%E4%B8%80%E8%A6%A7',
  chest: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0Body%EF%BC%88%E8%83%B4%E4%BD%93%EF%BC%89%E4%B8%80%E8%A6%A7',
  arm: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0Arms%EF%BC%88%E8%85%95%EF%BC%89%E4%B8%80%E8%A6%A7',
  leg: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0Legs%EF%BC%88%E8%84%9A%E9%83%A8%EF%BC%89%E4%B8%80%E8%A6%A7',
  back: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0Back%EF%BC%88%E8%83%8C%E4%B8%AD%EF%BC%89%E4%B8%80%E8%A6%A7',
  shield: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0Shield%EF%BC%88%E7%9B%BE%EF%BC%89%E4%B8%80%E8%A6%A7',
  saber: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0%E3%82%B5%E3%83%BC%E3%83%99%E3%83%AB%EF%BC%88%E6%A0%BC%E9%97%98%EF%BC%89%E4%B8%80%E8%A6%A7',
  doublesaber: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0%E3%83%80%E3%83%96%E3%83%AB%E3%82%B5%E3%83%BC%E3%83%99%E3%83%AB%EF%BC%88%E6%A0%BC%E9%97%98%EF%BC%89%E4%B8%80%E8%A6%A7',
  axe: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0%E3%82%A2%E3%83%83%E3%82%AF%E3%82%B9%EF%BC%88%E6%A0%BC%E9%97%98%EF%BC%89%E4%B8%80%E8%A6%A7',
  bigsword: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0%E5%A4%A7%E5%89%A3%EF%BC%88%E6%A0%BC%E9%97%98%EF%BC%89%E4%B8%80%E8%A6%A7',
  lance: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0%E3%83%A9%E3%83%B3%E3%82%B9%EF%BC%88%E6%A0%BC%E9%97%98%EF%BC%89%E4%B8%80%E8%A6%A7',
  whip: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0%E3%83%A0%E3%83%81%EF%BC%88%E6%A0%BC%E9%97%98%EF%BC%89%E4%B8%80%E8%A6%A7',
  twinblade: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0%E3%83%84%E3%82%A4%E3%83%B3%E3%83%96%E3%83%AC%E3%83%BC%E3%83%89%EF%BC%88%E6%A0%BC%E9%97%98%EF%BC%89%E4%B8%80%E8%A6%A7',
  rifle: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0%E3%83%A9%E3%82%A4%E3%83%95%E3%83%AB%EF%BC%88%E5%B0%84%E6%92%83%EF%BC%89%E4%B8%80%E8%A6%A7',
  longrifle: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0%E3%83%AD%E3%83%B3%E3%82%B0%E3%83%A9%E3%82%A4%E3%83%95%E3%83%AB%EF%BC%88%E5%B0%84%E6%92%83%EF%BC%89%E4%B8%80%E8%A6%A7',
  doublerifle: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0%E3%83%80%E3%83%96%E3%83%AB%E3%83%A9%E3%82%A4%E3%83%95%E3%83%AB%EF%BC%88%E5%B0%84%E6%92%83%EF%BC%89%E4%B8%80%E8%A6%A7',
  machinegun: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0%E3%83%9E%E3%82%B7%E3%83%B3%E3%82%AC%E3%83%B3%EF%BC%88%E5%B0%84%E6%92%83%EF%BC%89%E4%B8%80%E8%A6%A7',
  bazooka: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0%E3%83%90%E3%82%BA%E3%83%BC%E3%82%AB%EF%BC%88%E5%B0%84%E6%92%83%EF%BC%89%E4%B8%80%E8%A6%A7',
  gatlinggun: 'https://wiki.dengekionline.com/gbm/%E6%94%B9%E9%80%A0%E3%82%AC%E3%83%88%E3%83%AA%E3%83%B3%E3%82%B0%E3%82%AC%E3%83%B3%EF%BC%88%E5%B0%84%E6%92%83%EF%BC%89%E4%B8%80%E8%A6%A7',
};

const object = {
  wiki: [],
};

async function test(url) {
  return await fetch(url).then((response) =>
    response.text().then((responseHtml) => {
      // parse the HTML string into a DOM-like object we can navigate
      const document = parser.parse(responseHtml);
      let parts = Array.from(document.querySelectorAll('td a'));
      let promises = parts.map((part) => {
        console.log(part.getAttribute('href'));
      });
      parts.reduce(function(cur, next) {
        return cur.then(function() {
          return getHtmlDocumentFromUrl(`https://wiki.dengekionline.com${next.getAttribute('href')}`).then((data) => {
            object.wiki.push(data);
          });
        });
      }, Promise.resolve()).then(function() {
          //all executed
        console.log(object.wiki);
        var json = JSON.stringify(object);
        fs.writeFile('wiki.json', json, 'utf8', () => {});
      });
    })
  );
}

Object.entries(CATEGORY_URL).forEach(([k, v]) => {
  test(v);
});