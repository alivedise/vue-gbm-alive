import parser from "node-html-parser";
import fetch from "node-fetch";
import findElementWithText from './findElementWithText.mjs';

const URL = 'https://wiki.dengekionline.com/gbm/%E6%A9%9F%E4%BD%93%E4%B8%80%E8%A6%A7/%E3%80%90%E6%94%B9%E9%80%A0%E3%80%91%E3%83%88%E3%83%BC%E3%83%AB%E3%82%AE%E3%82%B9%E2%85%A2%EF%BC%BBEndless_Waltz%E7%89%88%EF%BC%BD';

async function getHtmlDocumentFromUrl(url = URL, addDate = '', isAltered = true) {
  return await fetch(url).then((response) =>
    response.text().then((responseHtml) => {
      // parse the HTML string into a DOM-like object we can navigate
      const document = parser.parse(responseHtml);
      let model = Array.from(document.querySelectorAll('th')).find(el => el.textContent === '型番').nextElementSibling.textContent || '';
      let icon = document.querySelector('img.lazy').getAttribute('data-original').split('?')[0];
      let story = findElementWithText(document, 'th', '作品')?.nextElementSibling.textContent || '';
      let machineName = findElementWithText(document, 'th', '名称')?.nextElementSibling.textContent || '';
      let property = Array.from(document.querySelectorAll('th')).find(el => el.textContent === '属性').nextElementSibling.textContent;
      let partsHeader = findElementWithText(document, 'h4', '関連パーツ');
      let rarity = findElementWithText(document, 'th', 'レアリティ')?.nextElementSibling.textContent.length || '';
      let parts = [];
      if (partsHeader) {
        parts = Array.from(partsHeader.nextElementSibling.querySelectorAll('tr')).map((row) => {
          return Array.from(row.querySelectorAll('th,td')).map((d) => {
            if (d.querySelector('a')) {
              return {
                name: d.textContent,
                wikiUrl: `https://wiki.dengekionline.com${d.querySelector('a').getAttribute('href')}`,
              }
            } else {
              return d.textContent;
            }
          });
        });
      }
      return {
        model,
        icon,
        story,
        machineName,
        property,
        rarity,
        parts,
        addDate,
        isNew: addDate !== '',
        isAltered,
        wikiUrl: url,
      };
    })
  );
}

getHtmlDocumentFromUrl().then((e) => {
  console.log(e);
});

export default getHtmlDocumentFromUrl;
