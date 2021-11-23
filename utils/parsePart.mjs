import parser from "node-html-parser";
import fetch from "node-fetch";

//const URL = `https://wiki.dengekionline.com/gbm/%E3%82%B5%E3%83%BC%E3%83%99%E3%83%AB%EF%BC%88%E6%A0%BC%E9%97%98%EF%BC%89%E4%B8%80%E8%A6%A7/%E3%80%90%E6%94%B9%E9%80%A0BIG%E3%80%91%E3%83%93%E3%83%BC%E3%83%A0%E3%83%BB%E3%82%B5%E3%83%BC%E3%83%99%E3%83%AB%EF%BC%BB%E3%83%A6%E3%83%8B%E3%82%B3%E3%83%BC%E3%83%B3%EF%BC%BD%EF%BC%88T%EF%BC%89%EF%BC%88%E6%A0%BC%E9%97%98%EF%BC%89`;
//const URL = `https://wiki.dengekionline.com/gbm/Head%EF%BC%88%E9%A0%AD%EF%BC%89%E4%B8%80%E8%A6%A7/%E3%80%90%E6%94%B9%E9%80%A0%E3%80%91%E3%82%A2%E3%82%B9%E3%83%88%E3%83%AC%E3%82%A4_%E3%83%96%E3%83%AB%E3%83%BC%E3%83%95%E3%83%AC%E3%83%BC%E3%83%A0%E3%82%BB%E3%82%AB%E3%83%B3%E3%83%89%E3%83%AA%E3%83%90%E3%82%A4%EF%BC%88%E9%A0%AD%EF%BC%89`;
//const URL = `https://wiki.dengekionline.com/gbm/Head%EF%BC%88%E9%A0%AD%EF%BC%89%E4%B8%80%E8%A6%A7/%E3%80%90%E6%94%B9%E9%80%A0%E3%80%91%E3%82%A2%E3%82%B9%E3%83%88%E3%83%AC%E3%82%A4_%E3%83%AC%E3%83%83%E3%83%89%E3%83%95%E3%83%AC%E3%83%BC%E3%83%A0%EF%BC%88%E9%A0%AD%EF%BC%89`;
//const URL = `https://wiki.dengekionline.com/gbm/Head%EF%BC%88%E9%A0%AD%EF%BC%89%E4%B8%80%E8%A6%A7/%E3%80%90%E6%94%B9%E9%80%A0%E3%80%91%E7%99%BE%E5%BC%8F%EF%BC%88%E9%A0%AD%EF%BC%89`;
//const URL = `https://wiki.dengekionline.com/gbm/%E3%83%A2%E3%82%B8%E3%83%A5%E3%83%BC%E3%83%AB%EF%BC%88%E6%A0%BC%E9%97%98%EF%BC%89%E4%B8%80%E8%A6%A7/%E3%82%AF%E3%83%AD%E3%83%BC%E3%83%A2%E3%82%B8%E3%83%A5%E3%83%BC%E3%83%AB%EF%BC%88%E6%A0%BC%E9%97%98%EF%BC%89`;
const URL = `https://wiki.dengekionline.com/gbm/%E3%83%A2%E3%82%B8%E3%83%A5%E3%83%BC%E3%83%AB%EF%BC%88%E6%A0%BC%E9%97%98%EF%BC%89%E4%B8%80%E8%A6%A7/%E3%82%AF%E3%83%AD%E3%83%BC%E3%83%A2%E3%82%B8%E3%83%A5%E3%83%BC%E3%83%AB%EF%BC%88%E6%A0%BC%E9%97%98%EF%BC%89`;

function findElementWithText(document, tag = 'th', text) {
  return Array.from(document.querySelectorAll(tag)).find((el) => {
    if (el.textContent.trim() === text) {
      return true;
    }
    const children = el.childNodes;
    return children.some(function (value) {
      if (value.nodeType === 3) {
        return value.rawText.trim() === text;
      }
      return false;
    });
  });
}

async function getHtmlDocumentFromUrl(url = URL) {
  return await fetch(url).then((response) =>
    response.text().then((responseHtml) => {
      // parse the HTML string into a DOM-like object we can navigate
      const document = parser.parse(responseHtml);
      let position = Array.from(document.querySelectorAll('th')).find(el => el.textContent === '部位').nextElementSibling.textContent;
      let model = Array.from(document.querySelectorAll('th')).find(el => el.textContent === '型番').nextElementSibling.textContent || '';
      let icon = document.querySelector('td img').getAttribute('data-original').split('?')[0];
      let machineName = Array.from(document.querySelectorAll('th')).find(el => el.textContent === '機体')?.nextElementSibling.textContent || '';
      let property = Array.from(document.querySelectorAll('th')).find(el => el.textContent === '属性').nextElementSibling.textContent;
      let sourceHeader = findElementWithText(document, 'h3', '入手方法');
      let source = '';
      if (sourceHeader) {
        source = Array.from(sourceHeader.nextElementSibling.querySelectorAll('tr')).map((row) => {
          return Array.from(row.querySelectorAll('th,td')).map(d => d.textContent);
        });
      }
      console.log(source);
      let paramHeader = findElementWithText(document, 'td', '99＋証');
      let skill = findElementWithText(document, 'h3', 'EXskill');
      let skillName = findElementWithText(skill?.nextElementSibling, 'th', '名称')?.nextElementSibling.textContent || '';
      let skillType = findElementWithText(skill?.nextElementSibling, 'th', 'カテゴリ')?.nextElementSibling.textContent || '';
      let skillDescription = findElementWithText(skill.nextElementSibling, 'th', '説明')?.nextElementSibling.textContent || '';
      let skillTable = [];
      if (skillName) {
        skillTable = Array.from(skill?.nextElementSibling?.nextElementSibling.querySelectorAll('tr')).map((row) => {
          return Array.from(row.querySelectorAll('th,td')).map(d => d.textContent);
        });
      }
      let passive = findElementWithText(document, 'h3', 'パーツ特性');
      let passive1 = findElementWithText(passive.nextElementSibling, 'th', '説明')?.nextElementSibling.textContent || '';
      let passive2 = '';
      let passive1Table = [];
      let passive2Table = [];
      if (!passive1) {
        let passive1Header = findElementWithText(document, 'h4', 'パーツ特性1');
        if (passive1Header) {
          passive1 = findElementWithText(passive1Header.nextElementSibling, 'th', '説明')?.nextElementSibling.textContent || '';
          passive1Table = Array.from(passive1Header.nextElementSibling.nextElementSibling.querySelectorAll('tr')).map((row) => {
            return Array.from(row.querySelectorAll('th,td')).map(d => d.textContent);
          });
        }
        let passive2Header = findElementWithText(document, 'h4', 'パーツ特性2');
        if (passive2Header) {
          passive2 = findElementWithText(passive2Header.nextElementSibling, 'th', '説明')?.nextElementSibling.textContent || '';
          passive2Table = Array.from(passive2Header.nextElementSibling.nextElementSibling.querySelectorAll('tr')).map((row) => {
            return Array.from(row.querySelectorAll('th,td')).map(d => d.textContent);
          });
        }
      } else {
        passive1Table = Array.from(passive.nextElementSibling.nextElementSibling.querySelectorAll('tr')).map((row) => {
          return Array.from(row.querySelectorAll('th,td')).map(d => d.textContent);
        });
      }
      let [wordTag1, wordTag2] = findElementWithText(document, 'h3', 'ワードタグ').nextElementSibling.querySelectorAll('th').map((e) => e.textContent);
      let subPart = findElementWithText(document, 'th', 'パーツ')?.textContent || '';
      let weaponType = findElementWithText(document, 'th', '武器種')?.nextElementSibling.textContent || '';
      let weaponAttackType = findElementWithText(document, 'th', 'タイプ')?.nextElementSibling.textContent || '';
      let rarity = findElementWithText(document, 'th', 'レアリティ')?.nextElementSibling.textContent.length || '';
      let aiTalent = findElementWithText(document, 'th', 'AI特性')?.nextElementSibling.textContent.length || '';
      let aiJob = findElementWithText(document, 'th', 'ジョブライセンス')?.nextElementSibling.textContent.length || '';
      let aiName = findElementWithText(document, 'th', 'AI')?.nextElementSibling.textContent.length || '';
      let aiImage = findElementWithText(document, 'th', 'AI')?.nextElementSibling.querySelector('img')?.getAttribute('data-original').split('?')[0] || '';
      let [, stamina, melee, range, meleeDefense, rangeDefense, beamRes, phyRes] = paramHeader.parentNode.querySelectorAll('td').map((el) => el.textContent);
      console.log(position, model, icon, machineName, property, source, stamina, melee, range, meleeDefense, rangeDefense, beamRes, phyRes, passive1, passive2, wordTag1, wordTag2, subPart, rarity, weaponType, weaponAttackType, aiTalent, aiJob, aiImage, aiName, passive2Table, passive1Table, skillTable);
      return {
        position,
        model,
        icon,
        machineName,
        property,
        source,
        stamina,
        melee,
        range,
        meleeDefense,
        rangeDefense,
        beamRes,
        phyRes,
        passive1,
        passive2,
        wordTag1,
        wordTag2,
        subPart,
        rarity,
        weaponType,
        weaponAttackType,
        aiImage,
        aiJob,
        aiName,
        aiTalent,
        passive1Table,
        passive2Table,
        skillTable,
        skillName,
        skillType,
        skillDescription,
        wikiUrl: url,
      };
    })
  );
}

getHtmlDocumentFromUrl().then((e) => {
  console.log(e);
});

export default getHtmlDocumentFromUrl;
