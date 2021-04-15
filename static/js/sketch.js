/*
 * This is a fantastic video: https://www.youtube.com/watch?v=DZfv0YgLJ2Q
 * Here is the github code used in the video: https://github.com/Code-Bullet/Chess-AI/blob/gh-pages/Chess/sketch.js
  * */

const TILE_SIZE = 100;
let movingPiece = null;

function setup() {
  createCanvas(800, 800);
  board = new Board();
}

function draw() {
  background(100);

  board.showGrid();
  board.showPieces();
}

// This doesn't currently work, maybe we need to use something like
// mouseDragged() or something like that
function mousePressed() {
  const x = floor(mouseX / TILE_SIZE);
  const y = floor(mouseY / TILE_SIZE);

  movingPiece = board.getPiece(x, y);

  if (movingPiece) movingPiece.moving = true;
}

// This doesn't currently work, maybe we need to use something like
// mouseDragged() or something like that
function mouseReleased() {
  const x = floor(mouseX / TILE_SIZE);
  const y = floor(mouseY / TILE_SIZE);

  movingPiece = board.getPiece();

  if (movingPiece) {
    movingPiece.move(x, y);
    movingPiece.moving = false;
  }
}
