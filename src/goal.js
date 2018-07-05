const GOAL = {
  x: 1000,
  y: 500,
  size: 300,
  reached: false,
};

function isPlayerInGoal() {
  if (isOverlapping({ x: chest.position.x, y: chest.position.y, size: chest.size }, GOAL)) {
    if (GOAL.reached) {
      GOAL.reached = false;
      GOAL.x = getRandomInt(worldXMin + 300, worldXMax - +300);
      GOAL.y = getRandomInt(-worldYMax + 600 + 300, 600);
    } else {
      GOAL.reached = true;
      score++;
    }
  }
}

function isOverlapping(obj1, obj2) {
  const dx = obj1.x - obj2.x;
  const dy = obj1.y - obj2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < obj1.size + obj2.size;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
