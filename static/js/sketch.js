/*
 * This is a fantastic video: https://www.youtube.com/watch?v=DZfv0YgLJ2Q
  * */

const tileSize = 100;
let movingPiece = null;
let moving = false;

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

  if (!moving) {
    if (board.pieceAt(x, y)) {
      movingPiece = board.getPiece(x, y);
      movingPiece.moving = true;
    }
  } else {
    movingPiece.move(x, y);
    movingPiece.moving = false;
  }

  moving = !moving;
}
