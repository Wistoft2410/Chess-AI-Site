let blackOrWhite;
let difficulty;

let board;
let computer;
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
    difficulty = 1;
  }

  whitesMove = true;
  movingPiece = null;

  board = new Board();
  computer = new AI();

  if (!blackOrWhite) computer.makeMove(board);
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

    const owningMovingPiece = movingPiece && movingPiece.white === blackOrWhite;
    const rightTurn = blackOrWhite === whitesMove;

    if (owningMovingPiece && rightTurn) movingPiece.moving = true;
  }
}

function mouseReleased() {

  const owningMovingPiece = movingPiece && movingPiece.white === blackOrWhite;
  const rightTurn = blackOrWhite === whitesMove;

  if (owningMovingPiece && rightTurn) {
    const x = floor(mouseX / Board.TILE_SIZE);
    const y = floor(mouseY / Board.TILE_SIZE);

    if (movingPiece.canMove(x, y, false)) {
      const location = movingPiece.matrixPosition.copy();
      const destination = createVector(x, y);

      // Move the actual piece on the real board
      movingPiece.move(x, y);

      // Switch the turn to the computer
      whitesMove = !whitesMove;

      // Execute some necessary board functionality, and basically update
      // the state of the board after the human player has made a turn
      board.run(whitesMove);

      movingPiece.moving = false;

      computer.setup(location, destination, whitesMove);
      computer.makeMove(board);
    }

    movingPiece.moving = false;
  }
}
