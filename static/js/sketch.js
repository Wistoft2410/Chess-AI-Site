/*
 * This is a good video, although I don't find him funny: https://www.youtube.com/watch?v=DZfv0YgLJ2Q
 * Here is the github code used in the video: https://github.com/Code-Bullet/Chess-AI
  * */

let movingPiece;
let whitesMove;
let board;


function setup() {
  createCanvas(800, 800);
  movingPiece = null;
  whitesMove = true;
  board = new Board();
}

function draw() {
  background(100);
  board.run();
}

function mousePressed(event) {
  // There is apparently some bug with right click.
  // It doens't make sence to respond to right click either,
  // So we are only responding to left click!
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

    if (movingPiece.canMove(x, y)) {
      movingPiece.move(x, y);

      // Switch turn to the next player
      whitesMove = !whitesMove;
    }

    movingPiece.moving = false;
  }
}
