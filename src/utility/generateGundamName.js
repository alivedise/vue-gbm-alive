export default function generateGundamName(pool, t) {
  let dice = 1;
  let name = '';
  while (dice > 0) {
    name += pool[Math.floor(Math.random() * pool.length)];
    dice -= Math.random();
  }
  return `${name}鋼彈`;
}
