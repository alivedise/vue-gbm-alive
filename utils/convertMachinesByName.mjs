import fs from 'fs';

let machines = fs.readFileSync('public/machines.json');
let original = fs.readFileSync('public/machine_data_by_name.json');
let raw = JSON.parse(machines);
let object = JSON.parse(original) || {};

raw.machines.forEach((data) => {
  object[data.machineName] = data;
});

var json = JSON.stringify(object);
fs.writeFile('public/machine_data_by_name.json', json, 'utf8', () => {});
