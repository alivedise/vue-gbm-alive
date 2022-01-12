import fs from 'fs';

let wikiRawdata = fs.readFileSync('public/wiki.json');
let wiki = JSON.parse(wikiRawdata);

let machineRawdata = fs.readFileSync('public/mahcines.json');
let machine = JSON.parse(machineRawdata);

const mapByWikiurl = {};
const machineMapByName = {};

wiki.wiki.forEach((data) => {
  mapByWikiurl[data.wikiUrl] = data;
});

machine.machines.forEach((m) => {
  machineMapByName[m.machineName] = m;
});

Object.values(machineMapByName).forEach((m) => {
  const differentAttribute = /（[T|P|S]\）$/.exec(m.machineName);
  if (!differentAttribute) {
    return;
  }
  let rawMachineName = m.machineName.replace(differentAttribute, '');
  let alterPrefix = /【.*】/.exec(rawMachineName);
  alterPrefix = alterPrefix || '';
  rawMachineName = rawMachineName.replace(alterPrefix, '');

  let originalMachine = machineMapByName[rawMachineName];
  if (alterPrefix) {
    if (machineMapByName[`【改造】${rawMachineName}`]) {
      originalMachine = machineMapByName[`【改造】${rawMachineName}`];
    } else if (machineMapByName[`【改造BIG】${rawMachineName}`]) {
      originalMachine = machineMapByName[`【改造BIG】${rawMachineName}`];
    }
  }
  if (!originalMachine) {
    console.error('cannot find', rawMachineName);
    return;
  }
  m.parts.forEach((dp) => {
    if (!Array.isArray(dp[1])) {
      return;
    }
    const matched = originalMachine.parts.find((op) => {
      return op[0] === dp[0];
    });
    if (!matched) {
      return;
    }
    const a = mapByWikiurl[dp[1].wikiUrl];
    const b = mapByWikiurl[matched.wikiUrl];
    if (!a.linked) {
      a.linked = [];
    }
    if (!b.linked) {
      b.linked = [];
    }
    a.linked.push(b.id);
    b.linked.push(a.id);
  });
});

var json2 = JSON.stringify(wiki);
fs.writeFile('public/wiki.json', json2, 'utf8', () => {});
