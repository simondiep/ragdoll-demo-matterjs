let engine;
let canvas;
let context;
let chest; // Focal point
const renderWidth = 1200;
const renderHeight = 600;

// To bound the world coordinates
const worldXMin = -10000;
const worldXMax = 10000;
const worldYMin = -1000;
const worldYMax = 10000;

// Store previous locations to indicate motion
const lastPositions = [];
const NUMBER_OF_LAST_POSITIONS = 10;

let mouseDownTimestamp;
let clickedLocation;
const kickingLegs = [];

let camX;
let camY;

function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}
