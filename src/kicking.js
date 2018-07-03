// Create a kicking leg on click
function onMouseDown(event) {
  if (event.button !== 0) {
    return;
  }
  event.preventDefault();
  mouseDownTimestamp = Date.now();

  const x = event.clientX - canvas.offsetLeft;
  const y = event.clientY - canvas.offsetTop;
  clickedLocation = {
    x,
    y,
  };
}

function onMouseUp(event) {
  // Biggr leg based on how long you hold click down
  const legScale = Math.floor((Date.now() - mouseDownTimestamp) / 200) + 1;

  const x = event.clientX - canvas.offsetLeft;
  const y = event.clientY - canvas.offsetTop;

  let quadrantClicked;
  let legProps;
  // TODO horizontally/vertically flip the image
  // if (x < canvas.width / 2 && y < canvas.height / 2) {
  quadrantClicked = "NW";
  // Leg extends down, foot extends right, 45 degree angle
  legProps = {
    legDirection: "down",
    footDirection: "right",
    angle: degreesToRadians(45),
  };
  // } else if (x < canvas.width / 2 && y >= canvas.height / 2) {
  //   quadrantClicked = "SW";
  //   // Leg extends up, foot extends right, -45 degree angle
  //   legProps = {
  //     legDirection: "up",
  //     footDirection: "right",
  //     angle: degreesToRadians(-45),
  //   };
  // } else if (x > canvas.width / 2 && y <= canvas.height / 2) {
  //   quadrantClicked = "NE";
  //   // Leg extends down, foot extends left, -45 degree angle
  //   legProps = {
  //     legDirection: "down",
  //     footDirection: "left",
  //     angle: degreesToRadians(-45),
  //   };
  // } else {
  //   quadrantClicked = "SE";
  //   // Leg extends up, foot extends left, 45 degree angle
  //   legProps = {
  //     legDirection: "up",
  //     footDirection: "left",
  //     angle: degreesToRadians(45),
  //   };
  // }

  const legDirectionOffsetX = legProps.footDirection === "right" ? -40 : 40;
  const legDirectionOffsetY = legProps.legDirection === "down" ? -80 : 80;
  const legWidth = 40 * legScale;
  const legHeight = 120 * legScale;
  const leg = Matter.Bodies.rectangle(
    x - camX + legDirectionOffsetX * legScale,
    y - camY + legDirectionOffsetY * legScale,
    legWidth,
    legHeight,
    {
      mass: 5,
      friction: 1,
      frictionAir: 0.03,
      collisionFilter: {
        group: -10,
      },
      render: {
        fillStyle: "blue",
      },
    },
  );
  leg.width = legWidth;
  leg.height = legHeight;
  leg.image = document.getElementById("legImg");

  const footDirectionOffsetX = legProps.footDirection === "left" ? 25 : -25;
  const footDirectionOffsetY = -15;
  const footWidth = 80 * legScale;
  const footHeight = 40 * legScale;
  const foot = Matter.Bodies.rectangle(
    x - camX + footDirectionOffsetX * legScale,
    y - camY + footDirectionOffsetY,
    footWidth,
    footHeight,
    {
      mass: 10,
      friction: 1,
      frictionAir: 0.03,
      collisionFilter: {
        group: -10,
      },
      render: {
        fillStyle: "#654321",
      },
    },
  );
  // custom render properties
  foot.width = footWidth;
  foot.height = footHeight;
  foot.image = document.getElementById("footImg");
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
  mouseDownTimestamp = null;
  clickedLocation = null;
}
