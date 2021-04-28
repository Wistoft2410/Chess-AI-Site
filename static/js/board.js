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

  run() {
    // Functionality
    this.promotePawn();
    this.removeCapturedPiece();
    this.removePassantVulnerability();

    // Display
    this.showGrid();
    this.showPieces();
  }

  removeCapturedPiece() {
    this.pieces = this.pieces.filter(piece => !piece.captured);
  }

  promotePawn() {
    const pawn = this.pieces.find(piece => piece.promoted);

    if (pawn) {
      this.pieces.push(new Queen(pawn.matrixPosition.x, pawn.white ? 0 : 7, pawn.white));
      // Remove the promoted pawn
      this.pieces = this.pieces.filter(piece => !piece.promoted);
    }
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
    for (let i = 0; i < this.pieces.length; i++) this.pieces[i].show();
  }

  getPiece(x, y) {
    for (let piece of this.pieces) {
      const matrixPosition = piece.matrixPosition;
      if (matrixPosition.x === x && matrixPosition.y === y) return piece;
    }

    return null;
  }
}
