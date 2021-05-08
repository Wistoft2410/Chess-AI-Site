class Board {
  constructor() {
    this.pieces = [];

    this.setupPieces();
  }

  static TILE_SIZE = 100;
  static blackTileColor = [22, 98, 214];
  static whiteTileColor = [245, 245, 220];

  setupPieces() {
    // All the white pieces
    this.pieces.push(new Rook(0, 7, true));
    this.pieces.push(new Knight(1, 7, true));
    this.pieces.push(new Bishop(2, 7, true));
    this.pieces.push(new Queen(3, 7, true));
    this.pieces.push(new King(4, 7, true));
    this.pieces.push(new Bishop(5, 7, true));
    this.pieces.push(new Knight(6, 7, true));
    this.pieces.push(new Rook(7, 7, true));
    for (let i = 0; i < 8; i++) this.pieces.push(new Pawn(i, 6, true));

    // All the black pieces
    this.pieces.push(new Rook(0, 0, false));
    this.pieces.push(new Knight(1, 0, false));
    this.pieces.push(new Bishop(2, 0, false));
    this.pieces.push(new Queen(3, 0, false));
    this.pieces.push(new King(4, 0, false));
    this.pieces.push(new Bishop(5, 0, false));
    this.pieces.push(new Knight(6, 0, false));
    this.pieces.push(new Rook(7, 0, false));
    for (let i = 0; i < 8; i++) this.pieces.push(new Pawn(i, 1, false));
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

  showPieces() {
    for (let piece of this.pieces) piece.show();
  }

  run() {
    // I think it's important that we call the functions in this order.
    // Especially with calling checkKing() in the end, we want to remove captured pieces
    // before calling checkKing()!
    this.removeCapturedPiece();
    this.removePassantVulnerability();
    this.promotePawn();
    this.checkKing();
  }

  promotePawn() {
    const pawn = this.pieces.find(piece => piece.promoted);

    if (pawn) {
      // You can actually choose between bishop, knight, rook, or queen to be replaced by your pawn.
      // But we assume that the player always wants a queen. A knight could also be prefereable in some 
      // situations, but we just replace the pawn with a queen with no questions asked for now.
      // Look here for more info: https://en.wikipedia.org/wiki/Promotion_(chess)
      this.pieces.push(new Queen(pawn.matrixPosition.x, pawn.white ? 0 : 7, pawn.white));
      // Remove the promoted pawn
      this.pieces = this.pieces.filter(piece => !piece.promoted);
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

  checkKing() {
    const kingPiece = this.pieces.find(piece => piece.constructor.name === "King" && piece.white === whitesMove);
    const matrixPosition = kingPiece.matrixPosition;

    kingPiece.check = this.canEnemyPiecesMoveToLocation(matrixPosition.x, matrixPosition.y, kingPiece.white);
  }

  // This function should only be used for King pieces, but it should also be applicable to other pieces aswell,
  // except pawns. It seems like pawns are a bit too complex, a bug would probably pop up with the passant move
  isInCheck(pieceToCheck, x, y) {
    const oldMatrixPosition = pieceToCheck.matrixPosition.copy();
    // We set the piece's position exactly to the specified position (x, y) to really simulate
    // if pieces can get to it's location and capture it!
    // If we didn't do this a bug would pop up because of the moveThroughPieces() method inside the piece class.
    // The method checks if a specific piece passes through other pieces on it's way to it's destination, if it does
    // the method returns true, and we don't want it to pass through the "pieceToCheck" on it's way to the potential (x, y)
    // coordinates!
    pieceToCheck.matrixPosition.set(x, y);

    const check = this.canEnemyPiecesMoveToLocation(x, y, pieceToCheck.white);

    // And here we revert to the piece's old position as we don't know if the piece should move there,
    // that is handled by the piece's move() method!
    pieceToCheck.matrixPosition.set(oldMatrixPosition);

    return check;
  }

  canEnemyPiecesMoveToLocation(x, y, white) {
    return this.pieces.filter(piece => piece.white !== white).some(piece => piece.canMove(x, y));
  }

  isKingInCheck(white) {
    return this.pieces.find(piece => (
      piece.constructor.name === "King" &&
      piece.white === white &&
      piece.check
    ));
  }

  getPiece(x, y) {
    return this.pieces.find(piece => piece.matrixPosition.x === x && piece.matrixPosition.y === y)
  }
}
