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
  camX = clamp(
    -playerCoordinates.x + renderWidth / 2,
    worldXMin,
    worldXMax - renderWidth,
  );
  camY = clamp(
    -playerCoordinates.y + (renderHeight * 3) / 5,
    worldYMin,
    worldYMax - renderHeight,
  );

  context.translate(camX, camY);

  // Draw patterned background image
  const backgroundImage = document.getElementById("backgroundImage");
  const ptrn = context.createPattern(backgroundImage, "repeat"); // Create a pattern with this image, and set it to "repeat".
  context.fillStyle = ptrn;
  context.fillRect(worldXMin, -worldYMax, worldXMax * 2, worldYMax * 2);

  document.getElementById("xPosition").innerHTML = playerCoordinates.x.toFixed(
    0,
  );
  document.getElementById("yPosition").innerHTML = perceivedHeight.toFixed(0);
}

function render() {
  var bodies = Matter.Composite.allBodies(engine.world);

  adjustCameraToPlayer();

  // draw last positions as dot trail to indicate motion
  for (var i = 0; i < lastPositions.length; i++) {
    const ratio = (i + 1) / lastPositions.length;
    context.beginPath();
    context.arc(
      lastPositions[i].x,
      lastPositions[i].y,
      20,
      0,
      2 * Math.PI,
      true,
    );
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

  const currentTime = Date.now();
  // rotate kicking legs
  for (let i = kickingLegs.length - 1; i >= 0; i--) {
    const leg = kickingLegs[i];
    let rotation;
    switch (leg.quadrantClicked) {
      case "NW":
        rotation = -0.1;
        break;
      case "SW":
        rotation = 0.1;
        break;
      case "NE":
        rotation = 0.1;
        break;
      case "SE":
        rotation = -0.1;
        break;
    }
    Matter.Body.rotate(leg, rotation);
    if (currentTime > leg.expireTime) {
      Matter.World.remove(engine.world, leg);
      kickingLegs.splice(i, 1);
    }
  }
}

// Custom renderer
function renderBodyPart(bodyPart) {
  if (bodyPart.label === "Body") {
    return;
  }
  // if (bodyPart.image) {
  //   context.save();
  //   context.rotate(bodyPart.angle);
  //   context.drawImage(bodyPart.image, bodyPart.position.x, bodyPart.position.y, bodyPart.vertices[1].x - bodyPart.vertices[0].x, bodyPart.vertices[1].y - bodyPart.vertices[0].y);
  //   context.restore();
  //   return;
  // }

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
