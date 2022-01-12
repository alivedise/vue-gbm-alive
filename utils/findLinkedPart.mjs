import fs from 'fs';

let wikiRawdata = fs.readFileSync('public/wiki.json');
let wiki = JSON.parse(wikiRawdata);

let machineRawdata = fs.readFileSync('public/machines.json');
let machine = JSON.parse(machineRawdata);

const mapByWikiurl = {};
const machineMapByName = {};

wiki.wiki.forEach((data) => {
  mapByWikiurl[data.wikiUrl] = data;
  data.linked = [];
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
  console.log(originalMachine, m);
  m.parts.forEach((dp) => {
    if (typeof dp[1] !== 'object') {
      return;
    }
    const matched = originalMachine.parts.find((op) => {
      console.log(op, dp);
      return op[0] === dp[0];
    });
    console.log(matched);
    if (!matched) {
      return;
    }
    const a = mapByWikiurl[dp[1].wikiUrl];
    const b = mapByWikiurl[matched[1].wikiUrl];
    if (!a.linked) {
      a.linked = [];
    }
    if (!b.linked) {
      b.linked = [];
    }
    a.linked.push(b.id);
    b.linked.push(a.id);
    console.log(a, b);
  });
});

var json2 = JSON.stringify(wiki);
fs.writeFile('public/wiki.json', json2, 'utf8', () => {});
