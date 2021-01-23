let canvas;
const mediumMapJson = require("./components/pages/assets/MediumMapFinished.json");
const mapData = mediumMapJson.layers[0];
const map = mapData.data;
let tileSize = 50;
let charSize = Math.floor(tileSize / 4);
let camera;

/** utils */

export const collisionManager = (isY, x, y, intent) => {
  let left = x - charSize;
  let right = x + charSize;
  let up = y + charSize;
  let down = y - charSize;

  //console.log(left, right, up, down);

  let templeft = left + (mapData.width * tileSize) / 2;
  let tempright = right + (mapData.width * tileSize) / 2;
  let tempup = up + (mapData.height * tileSize) / 2;
  let tempdown = down + (mapData.height * tileSize) / 2;

  let tryPositionleft = null;
  let tryPositionright = null;
  let tryPositionup = null;
  let tryPositiondown = null;

  if (isY) {
    tryPositionup = Math.floor(tempup + intent);
    tryPositiondown = Math.floor(tempdown + intent);
  } else {
    tryPositionleft = Math.floor(templeft + intent);
    tryPositionright = Math.floor(tempright + intent);
  }

  let displacement = 0.01;

  console.log(
    map[
      (Math.abs(mapData.height - Math.floor(tryPositionup / tileSize)) - 1) * mapData.width +
        Math.floor(templeft / tileSize)
    ]
  );

  if (isY) {
    /*
    console.log("Y");
    console.log(
      Math.abs(map.length - Math.floor(tryPositionup / tileSize)) - 1,
      Math.floor(templeft / tileSize)
    );
    console.log(
      Math.abs(map.length - Math.floor(tryPositionup / tileSize)) - 1,
      Math.floor(tempright / tileSize)
    );
    console.log(
      Math.abs(map.length - Math.floor(tryPositiondown / tileSize)) - 1,
      Math.floor(templeft / tileSize)
    );
    console.log(
      Math.abs(map.length - Math.floor(tryPositiondown / tileSize)) - 1,
      Math.floor(tempright / tileSize)
    );
     */

    if (
      map[
        (Math.abs(mapData.height - Math.floor(tryPositionup / tileSize)) - 1) * mapData.width +
          Math.floor(templeft / tileSize)
      ] === 257
    ) {
      return y - displacement;
    } else if (
      map[
        (Math.abs(mapData.height - Math.floor(tryPositionup / tileSize)) - 1) * mapData.width +
          Math.floor(tempright / tileSize)
      ] === 257
    ) {
      return y - displacement;
    } else if (
      map[
        (Math.abs(mapData.height - Math.floor(tryPositiondown / tileSize)) - 1) * mapData.width +
          Math.floor(templeft / tileSize)
      ] === 257
    ) {
      return y + displacement;
    } else if (
      map[
        (Math.abs(mapData.height - Math.floor(tryPositiondown / tileSize)) - 1) * mapData.width +
          Math.floor(tempright / tileSize)
      ] === 257
    ) {
      return y + displacement;
    }
  } else {
    /*
    console.log("X");
    console.log(
      Math.abs(map.length - Math.floor(tempup / tileSize)) - 1,
      Math.floor(tryPositionleft / tileSize)
    );
    console.log(
      Math.abs(map.length - Math.floor(tempdown / tileSize)) - 1,

      Math.floor(tryPositionleft / tileSize)
    );
    console.log(
      Math.abs(map.length - Math.floor(tempup / tileSize)) - 1,

      Math.floor(tryPositionright / tileSize)
    );
    console.log(
      Math.abs(map.length - Math.floor(tempdown / tileSize)) - 1,

      Math.floor(tryPositionright / tileSize)
    );
     */

    if (
      map[
        (Math.abs(mapData.height - Math.floor(tempup / tileSize)) - 1) * mapData.width +
          Math.floor(tryPositionleft / tileSize)
      ] === 257
    ) {
      return x + displacement;
    } else if (
      map[
        (Math.abs(mapData.height - Math.floor(tempup / tileSize)) - 1) * mapData.width +
          Math.floor(tryPositionright / tileSize)
      ] === 257
    ) {
      return x - displacement;
    } else if (
      map[
        (Math.abs(mapData.height - Math.floor(tempdown / tileSize)) - 1) * mapData.width +
          Math.floor(tryPositionleft / tileSize)
      ] === 257
    ) {
      return x + displacement;
    } else if (
      map[
        (Math.abs(mapData.height - Math.floor(tempdown / tileSize)) - 1) * mapData.width +
          Math.floor(tryPositionright / tileSize)
      ] === 257
    ) {
      return x - displacement;
    }
  }

  return isY ? y + intent : x + intent;
};

// converts a coordinate in a normal X Y plane to canvas coordinates
const convertCoordToCanvas = (x, y) => {
  if (!canvas) return;
  console.log(x, y);
  return {
    drawX: (mapData.width * tileSize) / 2 + x,
    drawY: (mapData.height * tileSize) / 2 - y,
  };
};

// fills a circle at a given x, y canvas coord with radius and color
const fillCircle = (context, x, y, radius, color) => {
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI, false);
  context.fillStyle = color;
  context.fill();
};

/** drawing functions */

const drawPlayer = (context, x, y, color) => {
  const { drawX, drawY } = convertCoordToCanvas(x, y);
  fillCircle(context, drawX, drawY, charSize, color);
};

/*
export const drawAllPlayers = (drawState) => {
  const { drawX, drawY } = convertCoordToCanvas(x, y);

  context.globalCompositeOperation = "destinaton-out";

  let gradient = context.createRadialGradient(drawX, drawY, 20, drawX, drawY, 100);
  gradient.addColorStop(0, "white");
  gradient.addColorStop(0.5, "grey");
  gradient.addColorStop(0.9, "black");
  gradient.addColorStop(1, "black");
  fillCircle(context, drawX, drawY, 100, gradient);
  context.globalCompositeOperation = "source-over";
  fillCircle(context, drawX, drawY, 20, color);
};
*/

/*
// main draw
export const drawCanvas = (drawState, userId) => {
  // get the canvas element
  canvas = document.getElementById("game-canvas");

  if (!canvas) return;
  const context = canvas.getContext("2d");

  // draw all the players
  Object.keys(drawState.players).map((id, index) => {
    const { x, y } = drawState.players[id].position;
    const color = "green"; // drawState.player.color
    drawPlayer(context, x, y, color);
  });

  const { x, y } = drawState.players[userId].position;
  let camX = clamp(-x + canvas.width / 2, -1000, 1000 - canvas.width);
  let camY = clamp(-y + canvas.height / 2, -1000, 1000 - canvas.height);
  //context.translate(camX, camY);
};
 */

export const drawAllPlayers = (drawState, context) => {
  Object.keys(drawState.players).map((id, index) => {
    const { x, y } = drawState.players[id].position;
    const color = "green"; // drawState.player.color
    drawPlayer(context, x, y, color);
  });
};

const drawTile = (context, x, y, color) => {
  context.fillStyle = color;
  context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
};

const clamp = (value, min, max) => {
  if (value < min) return min;
  else if (value > max) return max;
  return value;
};

/** main draw */
export const drawCanvas = (drawState, userId) => {
  // get the canvas element
  canvas = document.getElementById("game-canvas");
  if (!canvas) return;
  const context = canvas.getContext("2d");

  // Makes the canvas responsive to width changes

  // Helps fix blurry canvas issue
  //let dpi = window.devicePixelRatio;
  //let style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
  //let style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
  //canvas.setAttribute("height", style_height * dpi);
  //canvas.setAttribute("width", style_width * dpi);
  //{players: [{x: 0, y: 0, color: white}]}

  context.setTransform(1, 0, 0, 1, 0, 0);

  //canvas.height = 1000;
  //canvas.width = 1400;

  const { x, y } = drawState.players[userId].position;
  //let camX = clamp(-x + canvas.width / 2, 0, map[0].length - canvas.width/2);
  //let camY = clamp(-y + canvas.height / 2, 0, map.length - canvas.height/2);
  //context.translate(camX, camY);

  // clear the canvas to black
  context.clearRect(0, 0, canvas.width, canvas.height);
  //context.scale(2, 2);
  context.translate(
    -x - ((window.screen.width - canvas.width) / (mapData.width * tileSize)) * canvas.width,
    y -
      ((window.screen.height - canvas.height) / (mapData.height * tileSize)) * canvas.height -
      canvas.height / 2
  );
  //dcontext.scale(2, 2);

  map.forEach((element, index) => {
    let row = Math.floor(index / mapData.width);
    let column = index % mapData.width;
    if (map[index] == 257) drawTile(context, column, row, "red");
  });

  drawAllPlayers(drawState, context);
};

// 11 rows
// 27 columns
export const mapNot = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
