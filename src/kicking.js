// Create a kicking leg on click
function onMouseDown(event) {
  if (event.button !== 0) {
    return;
  }
  event.preventDefault();
  const x = event.clientX - canvas.offsetLeft;
  const y = event.clientY - canvas.offsetTop;
  mouseDown = true;

  let quadrantClicked;
  let legProps;
  if (x < canvas.width / 2 && y < canvas.height / 2) {
    quadrantClicked = "NW";
    // Leg extends down, foot extends right, 45 degree angle
    legProps = {
      legDirection: "down",
      footDirection: "right",
      angle: 45,
    };
  } else if (x < canvas.width / 2 && y >= canvas.height / 2) {
    quadrantClicked = "SW";
    // Leg extends up, foot extends right, -45 degree angle
    legProps = {
      legDirection: "up",
      footDirection: "right",
      angle: -45,
    };
  } else if (x > canvas.width / 2 && y <= canvas.height / 2) {
    quadrantClicked = "NE";
    // Leg extends down, foot extends left, -45 degree angle
    legProps = {
      legDirection: "down",
      footDirection: "left",
      angle: -45,
    };
  } else {
    quadrantClicked = "SE";
    // Leg extends up, foot extends left, 45 degree angle
    legProps = {
      legDirection: "up",
      footDirection: "left",
      angle: 45,
    };
  }

  const legDirectionOffsetX = legProps.footDirection === "right" ? -40 : 40;
  const legDirectionOffsetY = legProps.legDirection === "down" ? -80 : 80;
  const leg = Matter.Bodies.rectangle(
    x - camX + legDirectionOffsetX * KICK_LEG_SCALE,
    y - camY + legDirectionOffsetY * KICK_LEG_SCALE,
    40 * KICK_LEG_SCALE,
    120 * KICK_LEG_SCALE,
    {
      mass: 5,
      friction: 1,
      frictionAir: 0.03,
      collisionFilter: {
        group: -10,
      },
      chamfer: {
        radius: 2,
      },
      render: {
        fillStyle: "blue",
      },
    },
  );

  const footDirectionOffsetX = legProps.footDirection === "left" ? 20 : -20;
  const footDirectionOffsetY = 0;
  const foot = Matter.Bodies.rectangle(
    x - camX + footDirectionOffsetX * KICK_LEG_SCALE,
    y - camY + footDirectionOffsetY,
    80 * KICK_LEG_SCALE,
    40 * KICK_LEG_SCALE,
    {
      mass: 10,
      friction: 1,
      frictionAir: 0.03,
      collisionFilter: {
        group: -10,
      },
      chamfer: {
        radius: 2,
      },
      render: {
        fillStyle: "#654321",
      },
    },
  );
  // foot.image = document.getElementById('bootImg');
  const kickingLeg = Matter.Body.create({
    parts: [leg, foot],
    collisionFilter: {
      group: -10,
    },
  });
  kickingLeg.quadrantClicked = quadrantClicked;
  kickingLeg.expireTime = Date.now() + 400;
  Matter.Body.setAngle(kickingLeg, legProps.angle);
  Matter.Body.setStatic(kickingLeg, true);
  kickingLegs.push(kickingLeg);
  Matter.World.add(engine.world, [kickingLeg]);
}

// Not used atm
function onMouseUp(event) {
  mouseDown = false;
}
