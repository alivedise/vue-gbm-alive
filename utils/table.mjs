import parts from './tableData0.mjs';

const refined = parts.map((part) => {
  console.log(part[20]);
  part.forEach((v, i) => {
    console.log(v, i);
  });
  return {
    initialTime: part[33],
    cooldown: part[32],
    effectLastTime: part[35],
  };
});
