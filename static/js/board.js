class Board {
  constructor() {
    this.whitePieces = [];
    this.blackPieces = [];

    this.setupPieces();
  }

  setupPieces() {
    // All the white pieces
    this.whitePieces.push(new Rook(0, 7, true));
    this.whitePieces.push(new Knight(1, 7, true));
    this.whitePieces.push(new Bishop(2, 7, true));
    this.whitePieces.push(new Queen(3, 7, true));
    this.whitePieces.push(new King(4, 7, true));
    this.whitePieces.push(new Bishop(5, 7, true));
    this.whitePieces.push(new Knight(6, 7, true));
    this.whitePieces.push(new Rook(7, 7, true));

    for (let i = 0; i < 8; i++) this.whitePieces.push(new Pawn(i, 6, true));

    // All the black pieces
    this.blackPieces.push(new Rook(0, 0, true));
    this.blackPieces.push(new Knight(1, 0, true));
    this.blackPieces.push(new Bishop(2, 0, true));
    this.blackPieces.push(new Queen(3, 0, true));
    this.blackPieces.push(new King(4, 0, true));
    this.blackPieces.push(new Bishop(5, 0, true));
    this.blackPieces.push(new Knight(6, 0, true));
    this.blackPieces.push(new Rook(7, 0, true));

    for (let i = 0; i < 8; i++) this.blackPieces.push(new Pawn(i, 1, true));
  }

  showGrid() {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if ((i + j) % 2 == 0) {
          fill(255);
        } else {
          fill(0);
        }

        rect(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    } 
  }

  getPiece(x, y) {
    for (let piece of this.whitePieces) {
      const matrixPosition = piece.matrixPosition;
      if (matrixPosition.x === x && matrixPosition.y === y) return piece;
    }

    for (let piece of this.blackPieces) {
      const matrixPosition = piece.matrixPosition;
      if (matrixPosition.x === x && matrixPosition.y === y) return piece;
    }

    return null;
  }

  showPieces() {
    for (let i = 0; i < this.whitePieces.length; i++) {
      this.whitePieces[i].show();
      this.blackPieces[i].show();
    }
  }
}
