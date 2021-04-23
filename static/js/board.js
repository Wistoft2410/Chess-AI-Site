class Board {
  constructor() {
    this.whitePieces = [];
    this.blackPieces = [];

    this.setupPieces();
  }

  static TILE_SIZE = 100;
  static blackTileColor = [22, 98, 214];
  static whiteTileColor = [245, 245, 220];

  setupPieces() {
    // TODO: Actually I'm not sure if there is any point in keeping
    // the pieces seperated in two arrays, why not have every piece in on big array?
    // That would actually result in less code, which is more maintainable!

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
    this.blackPieces.push(new Rook(0, 0, false));
    this.blackPieces.push(new Knight(1, 0, false));
    this.blackPieces.push(new Bishop(2, 0, false));
    this.blackPieces.push(new Queen(3, 0, false));
    this.blackPieces.push(new King(4, 0, false));
    this.blackPieces.push(new Bishop(5, 0, false));
    this.blackPieces.push(new Knight(6, 0, false));
    this.blackPieces.push(new Rook(7, 0, false));

    for (let i = 0; i < 8; i++) this.blackPieces.push(new Pawn(i, 1, false));
  }

  run() {
    // Functionality
    this.promotePawn();
    this.removeCapturedPiece();

    // Display
    this.showGrid();
    this.showPieces();
  }

  removeCapturedPiece() {
    // TODO: Instead of doing this for both the whitePieces and the blackPieces
    // we could have some boolean value indicating which player
    // just made a move or something like that. I don't know if it's possible though!
    this.whitePieces = this.whitePieces.filter(piece => !piece.captured);
    this.blackPieces = this.blackPieces.filter(piece => !piece.captured);
  }

  promotePawn() {
    // TODO: Instead of doing this for both the whitePieces and the blackPieces
    // we could have some boolean value indicating which player
    // just made a move or something like that. I don't know if it's possible though!
    const whitePawn = this.whitePieces.find(piece => piece.promoted);
    const blackPawn = this.blackPieces.find(piece => piece.promoted);

    if (whitePawn) {
      this.whitePieces.push(new Queen(whitePawn.matrixPosition.x, 0, true));
      this.whitePieces = this.whitePieces.filter(piece => !piece.promoted);
    } else if (blackPawn) {
      this.blackPieces.push(new Queen(blackPawn.matrixPosition.x, 7, false));
      this.blackPieces = this.blackPieces.filter(piece => !piece.promoted);
    }
  }

  showGrid() {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if ((i + j) % 2 == 0) {
          fill(Board.whiteTileColor[0], Board.whiteTileColor[1], Board.whiteTileColor[2]);
        } else {
          fill(Board.blackTileColor[0], Board.blackTileColor[1], Board.blackTileColor[2]);
        }

        rect(i * Board.TILE_SIZE, j * Board.TILE_SIZE, Board.TILE_SIZE, Board.TILE_SIZE);
      }
    } 
  }

  showPieces() {
    for (let i = 0; i < this.whitePieces.length; i++) this.whitePieces[i].show();
    for (let i = 0; i < this.blackPieces.length; i++) this.blackPieces[i].show();
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
}
