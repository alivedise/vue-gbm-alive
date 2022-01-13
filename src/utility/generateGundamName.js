function shuffleArray(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

export default function generateGundamName(pool, t) {
  let dice = 1;
  let name = '';
  let type = '';
  let shiki = '';
  if (Math.random() < 0.1) {
    shiki = pool[Math.floor(Math.random() * pool.length)];
    shiki += pool[Math.floor(Math.random() * pool.length)];
    shiki += '式';
  }
  if (Math.random() < 0.3) {
    type += pool[Math.floor(Math.random() * pool.length)];
    type += pool[Math.floor(Math.random() * pool.length)];
    type += '型';
  }
  while (dice > 0) {
    name += pool[Math.floor(Math.random() * pool.length)];
    dice -= Math.random();
  }
  const shouldCombine = (type || shiki || name.length <= 4);
  return shuffleArray([type, shiki, shouldCombine ? `${name}鋼彈` : name, shouldCombine ? '' : '鋼彈']).join('');
}
