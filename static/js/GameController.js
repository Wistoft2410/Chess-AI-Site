/*
 * This is a good video, although I don't find him funny: https://www.youtube.com/watch?v=DZfv0YgLJ2Q
 * Here is the code used in the video: https://github.com/Code-Bullet/Chess-AI
  * */

let blackOrWhite;
let difficulty;

let board;
let whitesMove;
let movingPiece;

function setup() {
  createCanvas(800, 800);

  try {
    blackOrWhite = JSON.parse(Cookies.get('black_or_white'));
    difficulty = JSON.parse(Cookies.get('difficulty'));
  } catch (err) {
    // If an error occurs then we just use default settings    
    blackOrWhite = true;
    difficulty = 0;
  }

  whitesMove = true;
  movingPiece = null;

  board = new Board();
}

function draw() {
  background(100);
  board.display();

  if (board.checkmate) {
    const messageElement = document.getElementById("game-status-message");
    const h5 = messageElement.querySelector(".card-title");

    if (whitesMove) h5.textContent = `${h5.textContent} BLACK PLAYER!`;
    else h5.textContent = `${h5.textContent} WHITE PLAYER!`;

    messageElement.classList.remove("invisible");
    noLoop();
  }
}

function mousePressed() {
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
  if (movingPiece) {
    const x = floor(mouseX / Board.TILE_SIZE);
    const y = floor(mouseY / Board.TILE_SIZE);

    if (movingPiece.canMove(x, y, false)) {
      movingPiece.move(x, y);

      // Here we switch the turn to the next player
      whitesMove = !whitesMove;

      // Here we execute some necessary board functionality, and basically update 
      // the state of the board after the player has made a turn
      board.run(whitesMove);
    }

    movingPiece.moving = false;
  }
}
