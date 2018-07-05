function adjustCameraToPlayer() {
  function clamp(value, min, max) {
    if (value < min) return min;
    else if (value > max) return max;
    return value;
  }

  context.setTransform(1, 0, 0, 1, 0, 0); // reset

  const playerCoordinates = {
    x: chest.vertices[0].x,
    y: chest.vertices[0].y,
  };
  const perceivedHeight = renderHeight - playerCoordinates.y;

  context.fillStyle = "black";
  context.fillRect(0, 0, renderWidth, renderHeight);
  //Clamp the camera position to the world bounds while centering the camera around the player
  camX = clamp(-playerCoordinates.x + renderWidth / 2, worldXMin, worldXMax - renderWidth);
  camY = clamp(-playerCoordinates.y + (renderHeight * 3) / 5, worldYMin, worldYMax - renderHeight);

  context.translate(camX, camY);

  // Draw patterned background image
  const backgroundImage = document.getElementById("backgroundImage");
  const ptrn = context.createPattern(backgroundImage, "repeat"); // Create a pattern with this image, and set it to "repeat".
  context.fillStyle = ptrn;
  context.fillRect(worldXMin, -worldYMax, worldXMax * 2, worldYMax * 2);

  document.getElementById("xPosition").innerHTML = playerCoordinates.x.toFixed(0);
  document.getElementById("yPosition").innerHTML = perceivedHeight.toFixed(0);
}

function render() {
  var bodies = Matter.Composite.allBodies(engine.world);

  adjustCameraToPlayer();
  drawGoal();

  // draw last positions as dot trail to indicate motion
  for (var i = 0; i < lastPositions.length; i++) {
    const ratio = (i + 1) / lastPositions.length;
    context.beginPath();
    context.arc(lastPositions[i].x, lastPositions[i].y, 20, 0, 2 * Math.PI, true);
    context.fillStyle = "rgba(224, 164, 35, " + ratio / 4 + ")";
    context.fill();
  }

  for (var i = 0; i < bodies.length; i += 1) {
    if (bodies[i].parts.length > 1) {
      for (let part of bodies[i].parts) {
        renderBodyPart(part);
      }
    } else {
      renderBodyPart(bodies[i]);
    }
  }

  drawArrowToGoal();

  // draw indicator if click is being held down
  if (clickedLocation) {
    const dotColor = Date.now() % 2 == 0 ? "rgba(255,255,255,0.2)" : "rgba(155,155,155,0.2)";
    const dotSize = Math.floor((Date.now() - mouseDownTimestamp) / 200) * 10 + 20;
    context.beginPath();
    context.arc(clickedLocation.x - camX, clickedLocation.y - camY, dotSize, 0, 2 * Math.PI, true);
    context.fillStyle = dotColor;
    context.fill();
  }

  const currentTime = Date.now();
  // rotate kicking legs
  for (let i = kickingLegs.length - 1; i >= 0; i--) {
    const leg = kickingLegs[i];
    let rotation = degreesToRadians(-6);
    // switch (leg.quadrantClicked) {
    //   case "NW":
    //     rotation = degreesToRadians(-6);
    //     break;
    //   case "SW":
    //     rotation = degreesToRadians(6);
    //     break;
    //   case "NE":
    //     rotation = degreesToRadians(6);
    //     break;
    //   case "SE":
    //     rotation = degreesToRadians(-6);
    //     break;
    // }
    Matter.Body.rotate(leg, rotation);
    if (currentTime > leg.expireTime) {
      Matter.World.remove(engine.world, leg);
      kickingLegs.splice(i, 1);
    }
  }

  drawText(
    chest.position.x - (canvas.width * 2) / 5,
    chest.position.y - (canvas.height * 4) / 7,
    "white",
    `Score: ${score}`,
    36,
  );
}

// Custom renderer
function renderBodyPart(bodyPart) {
  if (bodyPart.label === "Body") {
    return;
  }
  if (bodyPart.image) {
    context.save();
    context.translate(bodyPart.position.x, bodyPart.position.y);
    context.rotate(bodyPart.angle);
    context.drawImage(bodyPart.image, -bodyPart.width / 2, -bodyPart.height / 2, bodyPart.width, bodyPart.height);
    context.restore();
    return;
  }

  var vertices = bodyPart.vertices;
  context.beginPath();
  context.moveTo(vertices[0].x, vertices[0].y);

  for (var j = 1; j < vertices.length; j += 1) {
    context.lineTo(vertices[j].x, vertices[j].y);
  }

  context.lineTo(vertices[0].x, vertices[0].y);
  context.closePath();
  context.fillStyle = bodyPart.render.fillStyle;
  context.fill();

  if (bodyPart.label === "chest") {
    storeLastPosition(bodyPart.position.x, bodyPart.position.y);
  }
}

function drawGoal() {
  context.beginPath();
  context.arc(GOAL.x, GOAL.y, GOAL.size, 0, 2 * Math.PI, true);
  context.fillStyle = Date.now() % 2 == 0 ? "rgba(205,235,195,0.5)" : "rgba(185,215,175,0.5)";
  context.fill();
  if (GOAL.reached) {
    drawText(GOAL.x, GOAL.y, "white", "Score + 1");
  } else {
    drawText(GOAL.x, GOAL.y, "yellow", "Goal");
  }
}

function drawText(centerX, centerY, color, text, fontSize = 72) {
  context.save();
  context.lineWidth = 5;
  context.strokeStyle = "black";
  context.fillStyle = color;
  context.font = `bold ${fontSize}px Arial`;

  const textWidth = context.measureText(text).width;
  const textHeight = 24;
  let x = centerX - textWidth / 2;
  let y = centerY + textHeight / 2;

  // Draw text specifying the bottom left corner
  context.strokeText(text, x, y);
  context.fillText(text, x, y);
  context.restore();
}

function drawArrowToGoal() {
  const originPointX = 0;
  const originPointY = 0;
  const rotationInRadians = Math.atan2(GOAL.y - chest.position.y, GOAL.x - chest.position.x);
  context.save();
  context.fillStyle = "rgba(255, 255, 255, 0.2)";
  context.beginPath();
  context.translate(chest.position.x, chest.position.y);
  context.rotate(rotationInRadians);
  context.moveTo(originPointX, originPointY);
  context.lineTo(originPointX + 50, originPointY);
  context.lineTo(originPointX + 50, originPointY + 15);
  context.lineTo(originPointX + 75, originPointY - 10);
  context.lineTo(originPointX + 50, originPointY - 35);
  context.lineTo(originPointX + 50, originPointY - 20);
  context.lineTo(originPointX, originPointY - 20);
  context.lineTo(originPointX, 0);
  context.fill();
  context.restore();
}
