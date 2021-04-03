/*
 * This is a fantastic video: https://www.youtube.com/watch?v=DZfv0YgLJ2Q
  * */

const tileSize = 100;

function setup() {
  createCanvas(800, 800);
  board = new Board();
}

function draw() {
  background(100);

  board.showGrid();
  board.showPieces();
}

function mousePressed() {
  const x = floor(mouseX/tileSize);
  const y = floor(mouseY/tileSize);

  // TODO: be done with this method
}
