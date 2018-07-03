const GOAL = {
  x: 1000,
  y: 500,
  size: 300,
  won: false,
};

function isPlayerInGoal() {
  if (isOverlapping({ x: chest.position.x, y: chest.position.y, size: chest.size }, GOAL)) {
    GOAL.won = true;
  }
}

function isOverlapping(obj1, obj2) {
  const dx = obj1.x - obj2.x;
  const dy = obj1.y - obj2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < obj1.size + obj2.size;
}
