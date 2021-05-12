class Board {
  constructor() {
    this.pieces = [];
    this.setupPieces();
  }

  static TILE_SIZE = 100;
  static blackTileColor = [22, 98, 214];
  static whiteTileColor = [245, 245, 220];
  static canMoveColor = [124, 252, 0];
  static originalPositionColor = [105, 105, 105];
  static kingInCheckColor = [255, 0, 0];

  setupPieces() {
    const properQueenPosition = blackOrWhite ? 3 : 4;
    const properKingPosition = !blackOrWhite ? 3 : 4;

    // All the white pieces
    this.pieces.push(new Rook(0, 7, blackOrWhite));
    this.pieces.push(new Knight(1, 7, blackOrWhite));
    this.pieces.push(new Bishop(2, 7, blackOrWhite));
    this.pieces.push(new Queen(properQueenPosition, 7, blackOrWhite));
    this.pieces.push(new King(properKingPosition, 7, blackOrWhite));
    this.pieces.push(new Bishop(5, 7, blackOrWhite));
    this.pieces.push(new Knight(6, 7, blackOrWhite));
    this.pieces.push(new Rook(7, 7, blackOrWhite));
    for (let i = 0; i < 8; i++) this.pieces.push(new Pawn(i, 6, blackOrWhite));

    // All the black pieces
    this.pieces.push(new Rook(0, 0, !blackOrWhite));
    this.pieces.push(new Knight(1, 0, !blackOrWhite));
    this.pieces.push(new Bishop(2, 0, !blackOrWhite));
    this.pieces.push(new Queen(properQueenPosition, 0, !blackOrWhite));
    this.pieces.push(new King(properKingPosition, 0, !blackOrWhite));
    this.pieces.push(new Bishop(5, 0, !blackOrWhite));
    this.pieces.push(new Knight(6, 0, !blackOrWhite));
    this.pieces.push(new Rook(7, 0, !blackOrWhite));
    for (let i = 0; i < 8; i++) this.pieces.push(new Pawn(i, 1, !blackOrWhite));
  }

  display() {
    this.showGrid();
    this.showScenariosForMovingPiece();
    this.showKingInCheck();
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

  showScenariosForMovingPiece() {
    const movingPiece = this.pieces.find(piece => piece.moving);

    if (movingPiece) {
      ellipseMode(CENTER);
      const ellipseSize = Board.TILE_SIZE - 20;

      // Show original position only for pieces that are not kings and in check at the same time.
      // We have a different color for that one!
      if (movingPiece.constructor.name !== "King" || !this.checked(movingPiece)) {
        fill(Board.originalPositionColor[0], Board.originalPositionColor[1], Board.originalPositionColor[2]);
        ellipse(movingPiece.pixelPosition.x, movingPiece.pixelPosition.y, ellipseSize, ellipseSize);
      }

      // Show scenarios
      for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
          if (movingPiece.canMove(x, y, false)) {
            const pixelPositionX = x * Board.TILE_SIZE + (Board.TILE_SIZE / 2);
            const pixelPositionY = y * Board.TILE_SIZE + (Board.TILE_SIZE / 2);

            fill(Board.canMoveColor[0], Board.canMoveColor[1], Board.canMoveColor[2]);
            ellipse(pixelPositionX, pixelPositionY, ellipseSize, ellipseSize);
          }
        }
      } 
    }
  }

  showKingInCheck() {
    for (let piece of this.pieces) {
      if (piece.constructor.name === "King" && this.checked(piece)) {
        // We probably don't need to call ellipseMode(CENTER) here, since we
        // do it in the showScenariosForMovingPiece() method
        // but we do it here anyway for robustness!
        ellipseMode(CENTER);
        const ellipseSize = Board.TILE_SIZE - 20;

        fill(Board.kingInCheckColor[0], Board.kingInCheckColor[1], Board.kingInCheckColor[2]);
        ellipse(piece.pixelPosition.x, piece.pixelPosition.y, ellipseSize, ellipseSize);
      }
    }
  }

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
    this.checkMate();
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

  promotePawn() {
    const pawn = this.pieces.find(piece => piece.promoted);

    if (pawn) {
      // You can actually choose between bishop, knight, rook, or queen to be replaced by your pawn in a real chess game.
      // But we assume that the player always wants a queen. A knight could also be prefereable in some situations,
      // but we just replace the pawn with a queen with no questions asked for now.
      // Look here for more info: https://en.wikipedia.org/wiki/Promotion_(chess)
      this.pieces.push(new Queen(pawn.matrixPosition.x, pawn.promotionPosition, pawn.white));

      // Remove the promoted pawn
      this.pieces = this.pieces.filter(piece => piece !== pawn);
    }
  }

  checkMate() {
    const checkmate = this.pieces.filter(piece => piece.white === whitesMove).every(piece => {
      for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
          // return false to indicate that a piece could move to a
          // specific place and therefore indicating that the king
          // is not in checkmate. It could be in check though, but
          // that is a different matter
          if (piece.canMove(x, y, false)) return false;
        }
      }

      return true;
    });

    endGame = checkmate;
  }

  // This method should only be used for King pieces, but it should also be applicable to other pieces aswell,
  // except pawns. It seems like pawns are a bit too complex, a bug would probably pop up with the passant move
  isInCheck(piece, x, y) {
    const oldMatrixPosition = piece.matrixPosition.copy();

    // Temporarily remove a piece which have been attacked by the piece, to better simulate if the piece would be in check
    const attackedPiece = this.getPiece(x, y);
    if (attackedPiece) this.pieces = this.pieces.filter(piece => piece !== attackedPiece);

    // We set the piece's position exactly to the specified position (x, y) to really simulate
    // if pieces can get to it's location and capture it!
    // If we didn't do this a bug would pop up because of the moveThroughPieces() method inside the piece class.
    // The method checks if a specific piece passes through other pieces on it's way to it's destination, if it does
    // the method returns true, and we don't want it to pass through the "piece" on it's way to the potential (x, y)
    // coordinates!
    piece.matrixPosition.set(x, y);

    const check = this.checked(piece);

    // And here we revert to the piece's old position as we don't know if the piece is able to move there,
    // that is handled by the piece's move() method!
    piece.matrixPosition.set(oldMatrixPosition);
    // And here we insert the piece that have been attacked back into the game,
    // because just like above we don't know if the piece is able to attack it
    if (attackedPiece) this.pieces.push(attackedPiece);

    return check;
  }

  // This method should only be used for non king pieces!
  // This method checks if a piece's move puts it's own king in danger/check!
  isKingInCheck(pieceToCheck, x, y) {
    const oldMatrixPosition = pieceToCheck.matrixPosition.copy();

    // Temporarily remove a piece which have been attacked by the "pieceToCheck",
    // to better simulate if the king would be in check
    let attackedPiece;

    if (pieceToCheck.constructor.name === "Pawn" && pieceToCheck.passantAttack(x, y)) {
      attackedPiece = board.findPassantVulnerablePawn();
      this.pieces = this.pieces.filter(piece => piece !== attackedPiece);
    } else {
      attackedPiece = this.getPiece(x, y);
      if (attackedPiece) this.pieces = this.pieces.filter(piece => piece !== attackedPiece);
    }

    // We set the piece's position exactly to the specified position (x, y) to really simulate
    // if the piece was actually there when checking for king check!
    pieceToCheck.matrixPosition.set(x, y);

    const kingPiece = this.pieces.find(piece => piece.constructor.name === "King" && piece.white === pieceToCheck.white);

    const check = this.checked(kingPiece);

    // And here we revert to the piece's old position as we don't know if the piece is able to move there,
    // that is handled by the piece's move() method!
    pieceToCheck.matrixPosition.set(oldMatrixPosition);
    // And here we insert the piece that have been attacked back into the game,
    // because just like above we don't know if the "pieceToCheck" is able to attack it
    if (attackedPiece) this.pieces.push(attackedPiece);

    return check;
  }

  checked(pieceToCheck) {
    const x = pieceToCheck.matrixPosition.x;
    const y = pieceToCheck.matrixPosition.y;

    return this.pieces.filter(piece => piece.white !== pieceToCheck.white).some(piece => piece.canMove(x, y, true));
  }

  getPiece(x, y) {
    return this.pieces.find(piece => piece.matrixPosition.x === x && piece.matrixPosition.y === y)
  }
}
