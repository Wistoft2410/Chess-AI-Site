/*
 * This is a good video, although I don't find him funny: https://www.youtube.com/watch?v=DZfv0YgLJ2Q
 * Here is the github code used in the video: https://github.com/Code-Bullet/Chess-AI
  * */

let movingPiece;
let board;


function setup() {
  createCanvas(800, 800);
  board = new Board();
  movingPiece = null;
}

function draw() {
  background(100);

  board.showGrid();
  board.showPieces();
}


function mousePressed(event) {
  // There is apparently some bug with right click.
  // It doens't make sence to respond to right click either
  if (mouseButton === LEFT) {
    const x = floor(mouseX / Board.TILE_SIZE);
    const y = floor(mouseY / Board.TILE_SIZE);

    movingPiece = board.getPiece(x, y);
    if (movingPiece) movingPiece.moving = true;
  }
}

function mouseReleased() {
  if (movingPiece) {
    const x = floor(mouseX / Board.TILE_SIZE);
    const y = floor(mouseY / Board.TILE_SIZE);

    if (movingPiece.canMove(x, y)) movingPiece.move(x, y);

    movingPiece.moving = false;
  }
}
