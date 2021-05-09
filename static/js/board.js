class Board {
  constructor() {
    this.pieces = [];
    this.setupPieces();
  }

  static TILE_SIZE = 100;
  static blackTileColor = [22, 98, 214];
  static whiteTileColor = [245, 245, 220];

  setupPieces() {
    const correctQueenPosition = blackOrWhite ? 3 : 4;
    const correctKingPosition = !blackOrWhite ? 3 : 4;

    // All the white pieces
    this.pieces.push(new Rook(0, 7, blackOrWhite));
    this.pieces.push(new Knight(1, 7, blackOrWhite));
    this.pieces.push(new Bishop(2, 7, blackOrWhite));
    this.pieces.push(new Queen(correctQueenPosition, 7, blackOrWhite));
    this.pieces.push(new King(correctKingPosition, 7, blackOrWhite));
    this.pieces.push(new Bishop(5, 7, blackOrWhite));
    this.pieces.push(new Knight(6, 7, blackOrWhite));
    this.pieces.push(new Rook(7, 7, blackOrWhite));
    for (let i = 0; i < 8; i++) this.pieces.push(new Pawn(i, 6, blackOrWhite));

    // All the black pieces
    this.pieces.push(new Rook(0, 0, !blackOrWhite));
    this.pieces.push(new Knight(1, 0, !blackOrWhite));
    this.pieces.push(new Bishop(2, 0, !blackOrWhite));
    this.pieces.push(new Queen(correctQueenPosition, 0, !blackOrWhite));
    this.pieces.push(new King(correctKingPosition, 0, !blackOrWhite));
    this.pieces.push(new Bishop(5, 0, !blackOrWhite));
    this.pieces.push(new Knight(6, 0, !blackOrWhite));
    this.pieces.push(new Rook(7, 0, !blackOrWhite));
    for (let i = 0; i < 8; i++) this.pieces.push(new Pawn(i, 1, !blackOrWhite));
  }

  display() {
    this.showGrid();
    this.showPieces();
  }

  showGrid() {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const boardProperty = `${(i + j) % 2 === 0 ? "white" : "black"}TileColor`;

        fill(Board[boardProperty][0], Board[boardProperty][1], Board[boardProperty][2]);
        rect(i * Board.TILE_SIZE, j * Board.TILE_SIZE, Board.TILE_SIZE, Board.TILE_SIZE);
      }
    } 
  }

  // TODO: Show scenarios! Shouldn't be to hard!
  showPieces() {
    // We want to make sure that the piece the player is currently moving
    // is displayed on top of every other piece for better UX
    let pieceToShowLast;

    for (let piece of this.pieces) {
      if (piece.moving) pieceToShowLast = piece;
      else piece.show();
    }

    if (pieceToShowLast) movingPiece.show();
  }

  run() {
    // I think it's important that we call the methods in this order.
    this.removeCapturedPiece();
    this.removePassantVulnerability();
    this.promotePawn();
  }

  promotePawn() {
    const pawn = this.pieces.find(piece => piece.promoted);

    if (pawn) {
      // You can actually choose between bishop, knight, rook, or queen to be replaced by your pawn.
      // But we assume that the player always wants a queen. A knight could also be prefereable in some 
      // situations, but we just replace the pawn with a queen with no questions asked for now.
      // Look here for more info: https://en.wikipedia.org/wiki/Promotion_(chess)
      this.pieces.push(new Queen(pawn.matrixPosition.x, pawn.promotionPosition, pawn.white));

      // Remove the promoted pawn
      this.pieces = this.pieces.filter(piece => piece !== pawn);
    }
  }

  removeCapturedPiece() {
    this.pieces = this.pieces.filter(piece => !piece.captured);
  }

  removePassantVulnerability() {
    const pawn = this.findPassantVulnerablePawn();
    // If the pawn's color match the color of the current player's turn
    // then that means that the second player didn't make a passant attack
    // when the pawn was vulnerable to it. So we remove it's vulnerability
    if (pawn && pawn.white === whitesMove) pawn.passantVulnerability = false;
  }

  findPassantVulnerablePawn() {
    return this.pieces.find(piece => piece.passantVulnerability);
  }

  checked(pieceToCheck) {
    const x = pieceToCheck.matrixPosition.x;
    const y = pieceToCheck.matrixPosition.y;

    return !!this.pieces.filter(piece => piece.white !== pieceToCheck.white).some(piece => piece.canMove(x, y, true));
  }

  // This method should only be used for King pieces, but it should also be applicable to other pieces aswell,
  // except pawns. It seems like pawns are a bit too complex, a bug would probably pop up with the passant move
  isInCheck(piece, x, y) {
    const oldMatrixPosition = piece.matrixPosition.copy();
    // We set the piece's position exactly to the specified position (x, y) to really simulate
    // if pieces can get to it's location and capture it!
    // If we didn't do this a bug would pop up because of the moveThroughPieces() method inside the piece class.
    // The method checks if a specific piece passes through other pieces on it's way to it's destination, if it does
    // the method returns true, and we don't want it to pass through the "piece" on it's way to the potential (x, y)
    // coordinates!
    piece.matrixPosition.set(x, y);

    const check = this.checked(piece);

    // And here we revert to the piece's old position as we don't know if the piece should move there,
    // that is handled by the piece's move() method!
    piece.matrixPosition.set(oldMatrixPosition);

    return check;
  }

  // TODO: Clean this code up!!!
  // This method should only be used on non king pieces!
  // This method checks if a piece's move puts it's own king in danger/check!
  isKingInCheck(pieceToCheck, x, y) {
    const oldMatrixPosition = pieceToCheck.matrixPosition.copy();

    let attackedPawn;
    let attackedPiece;

    if (pieceToCheck.constructor.name === "pawn" && pieceToCheck.moveTwoFields(x, y)) {
      attackedPawn = board.findPassantVulnerablePawn();
      this.pieces = this.pieces.filter(piece => piece !== attackedPawn);

    } else {
      attackedPiece = this.getPiece(x, y);
      if (attackedPiece) this.pieces = this.pieces.filter(piece => piece !== attackedPiece);
    }

    // We set the piece's position exactly to the specified position (x, y) to really simulate
    // if the piece was actually there when checking for king check!
    pieceToCheck.matrixPosition.set(x, y);

    const kingPiece = this.pieces.find(piece => piece.constructor.name === "King" && piece.white === pieceToCheck.white);

    const check = this.checked(kingPiece);

    // Here we revert back to the old position
    pieceToCheck.matrixPosition.set(oldMatrixPosition);
    // Also make sure to put the pieces back in again!
    if (attackedPawn) this.pieces.push(attackedPawn);
    if (attackedPiece) this.pieces.push(attackedPiece);

    return check;
  }

  getPiece(x, y) {
    return this.pieces.find(piece => piece.matrixPosition.x === x && piece.matrixPosition.y === y)
  }
}
