// Create body parts and assemble them into a ragdoll
function createRagdoll(x, y) {
  // aliases
  const { Bodies, Body, Composite, Constraint } = Matter;

  const defaultCollisionGroup = -1;

  /*********************
   * Define Body Parts *
   *********************/
  const headOptions = {
    friction: 1,
    frictionAir: 0.05,
    render: {
      fillStyle: "#FFBC42",
    },
  };
  const chestOptions = {
    friction: 1,
    frictionAir: 0.05,
    collisionFilter: {
      group: defaultCollisionGroup - 1,
    },
    chamfer: {
      radius: 20,
    },
    label: "chest",
    render: {
      fillStyle: "#E0A423",
    },
  };
  const armOptions = {
    friction: 1,
    frictionAir: 0.03,
    collisionFilter: {
      group: defaultCollisionGroup,
    },
    chamfer: {
      radius: 10,
    },
    render: {
      fillStyle: "#FFBC42",
    },
  };
  const legOptions = {
    friction: 1,
    frictionAir: 0.03,
    collisionFilter: {
      group: defaultCollisionGroup - 1,
    },
    chamfer: {
      radius: 10,
    },
    render: {
      fillStyle: "#FFBC42",
    },
  };

  const lowerLegOptions = {
    friction: 1,
    frictionAir: 0.03,
    collisionFilter: {
      group: defaultCollisionGroup - 1,
    },
    chamfer: {
      radius: 2,
    },
    render: {
      fillStyle: "#E59B12",
    },
  };

  const head = Bodies.circle(x, y - 70, 30, headOptions);
  chest = Bodies.rectangle(x, y, 60, 80, chestOptions);
  const rightUpperArm = Bodies.rectangle(
    x + 40,
    y - 20,
    20,
    40,
    Object.assign({}, armOptions),
  );
  const rightLowerArm = Bodies.rectangle(
    x + 40,
    y + 20,
    20,
    60,
    Object.assign({}, armOptions),
  );
  const leftUpperArm = Bodies.rectangle(
    x - 40,
    y - 20,
    20,
    40,
    Object.assign({}, armOptions),
  );
  const leftLowerArm = Bodies.rectangle(
    x - 40,
    y + 20,
    20,
    60,
    Object.assign({}, armOptions),
  );
  const leftUpperLeg = Bodies.rectangle(
    x - 20,
    y + 60,
    20,
    40,
    Object.assign({}, legOptions),
  );
  const rightUpperLeg = Bodies.rectangle(
    x + 20,
    y + 60,
    20,
    40,
    Object.assign({}, legOptions),
  );
  const leftLowerLeg = Bodies.rectangle(
    x - 20,
    y + 100,
    20,
    60,
    Object.assign({}, lowerLegOptions),
  );
  const rightLowerLeg = Bodies.rectangle(
    x + 20,
    y + 100,
    20,
    60,
    Object.assign({}, lowerLegOptions),
  );

  const legTorso = Body.create({
    parts: [chest, leftUpperLeg, rightUpperLeg],
    collisionFilter: {
      group: defaultCollisionGroup - 1,
    },
  });

  /*****************************
   * Define Constraints/Joints *
   *****************************/
  const chestToRightUpperArm = Constraint.create({
    bodyA: legTorso,
    pointA: {
      x: 25,
      y: -40,
    },
    pointB: {
      x: -5,
      y: -10,
    },
    bodyB: rightUpperArm,
    stiffness: 0.2,
    render: {
      visible: false,
    },
  });
  const chestToLeftUpperArm = Constraint.create({
    bodyA: legTorso,
    pointA: {
      x: -25,
      y: -40,
    },
    pointB: {
      x: 5,
      y: -10,
    },
    bodyB: leftUpperArm,
    stiffness: 0.2,
    render: {
      visible: false,
    },
  });

  const upperToLowerRightArm = Constraint.create({
    bodyA: rightUpperArm,
    bodyB: rightLowerArm,
    pointA: {
      x: 0,
      y: 15,
    },
    pointB: {
      x: 0,
      y: -20,
    },
    stiffness: 0.2,
    render: {
      visible: false,
    },
  });

  const upperToLowerLeftArm = Constraint.create({
    bodyA: leftUpperArm,
    bodyB: leftLowerArm,
    pointA: {
      x: 0,
      y: 15,
    },
    pointB: {
      x: 0,
      y: -20,
    },
    stiffness: 0.2,
    render: {
      visible: false,
    },
  });

  const upperToLowerLeftLeg = Constraint.create({
    bodyA: legTorso,
    bodyB: leftLowerLeg,
    pointA: {
      x: -20,
      y: 60,
    },
    pointB: {
      x: 0,
      y: -25,
    },
    stiffness: 0.2,
    render: {
      visible: false,
    },
  });

  const upperToLowerRightLeg = Constraint.create({
    bodyA: legTorso,
    bodyB: rightLowerLeg,
    pointA: {
      x: 20,
      y: 60,
    },
    pointB: {
      x: 0,
      y: -25,
    },
    stiffness: 0.2,
    render: {
      visible: false,
    },
  });

  const headContraint = Constraint.create({
    bodyA: head,
    pointA: {
      x: 0,
      y: 20,
    },
    pointB: {
      x: 0,
      y: -50,
    },
    bodyB: legTorso,
    stiffness: 0.3,
    render: {
      visible: false,
    },
  });

  window.addEventListener("keydown", event => {
    const FORCE_VALUE = 0.05;
    switch (event.keyCode) {
      case 81: //q
        Matter.Body.applyForce(leftLowerArm, leftLowerArm.position, {
          x: -FORCE_VALUE,
          y: -FORCE_VALUE,
        });
        break;
      case 87: //w
        Matter.Body.applyForce(leftLowerLeg, leftLowerLeg.position, {
          x: -FORCE_VALUE,
          y: FORCE_VALUE,
        });
        break;
      case 79: //o
        Matter.Body.applyForce(rightLowerArm, rightLowerArm.position, {
          x: FORCE_VALUE,
          y: -FORCE_VALUE,
        });
        break;
      case 80: //p
        Matter.Body.applyForce(rightLowerLeg, rightLowerLeg.position, {
          x: FORCE_VALUE,
          y: FORCE_VALUE,
        });
        break;
    }
  });

  const person = Composite.create({
    bodies: [
      legTorso,
      head,
      leftLowerArm,
      leftUpperArm,
      rightLowerArm,
      rightUpperArm,
      leftLowerLeg,
      rightLowerLeg,
    ],
    constraints: [
      upperToLowerLeftArm,
      upperToLowerRightArm,
      chestToLeftUpperArm,
      chestToRightUpperArm,
      headContraint,
      upperToLowerLeftLeg,
      upperToLowerRightLeg,
    ],
  });
  return person;
}
