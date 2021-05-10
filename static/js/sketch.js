/*
 * This is a good video, although I don't find him funny: https://www.youtube.com/watch?v=DZfv0YgLJ2Q
 * Here is the code used in the video: https://github.com/Code-Bullet/Chess-AI
  * */

let movingPiece;
let whitesMove;
let board;

let blackOrWhite;
let difficulty;


function setup() {
  createCanvas(800, 800);
  movingPiece = null;
  whitesMove = true;

  // Retrieve cookie values
  try {
    blackOrWhite = JSON.parse(Cookies.get('black_or_white'));
    difficulty = JSON.parse(Cookies.get('difficulty'));
  } catch (err) {
    // If an error occurs then we just use default settings    
    blackOrWhite = true;
    difficulty = 0;
  }

  board = new Board();
}

function draw() {
  background(100);
  board.display();
}

function mousePressed() {
  // There is apparently some bug with right click.
  // It doens't make sence to respond to right click either,
  // So we are only responding to left click!
  if (mouseButton === LEFT) {
    const x = floor(mouseX / Board.TILE_SIZE);
    const y = floor(mouseY / Board.TILE_SIZE);

    movingPiece = board.getPiece(x, y);
    // If the piece exists and the piece belongs to/is controlled by the current player,
    // then the player is allowed to move that piece
    if (movingPiece && movingPiece.white === whitesMove) movingPiece.moving = true;
  }
}

function mouseReleased() {
  if (movingPiece && movingPiece.white === whitesMove) {
    const x = floor(mouseX / Board.TILE_SIZE);
    const y = floor(mouseY / Board.TILE_SIZE);

    if (movingPiece.canMove(x, y, false)) {
      movingPiece.move(x, y);

      // Here we switch the turn to the next player
      whitesMove = !whitesMove;

      // Here we execute some necessary board functionality, and basically update 
      // the state of the board after the player has made a turn
      board.run();
    }

    movingPiece.moving = false;
  }
}
