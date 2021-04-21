class Piece {
  constructor(x, y, isWhite, image) {
    this.pixelPosition = createVector(
      x * Board.TILE_SIZE + (Board.TILE_SIZE / 2),
      y * Board.TILE_SIZE + (Board.TILE_SIZE / 2)
    );

    this.matrixPosition = createVector(x, y);

    this.moving = false;
    this.taken = false;
    this.white = isWhite;
    this.image = loadImage(image);
  }

  static generatePieceImgPath(isWhite, fileNameExludingFirstChar) {
    const pieceImgPath = "static/images/pieces/";

    return `${pieceImgPath}${isWhite ? 'w' : 'b'}${fileNameExludingFirstChar}`;
  }

  show() {
    imageMode(CENTER);

    // Move with the mouse pointer
    if (this.moving) image(this.image, mouseX, mouseY, Board.TILE_SIZE * 1.2, Board.TILE_SIZE * 1.2);
    else {
      image(this.image, this.pixelPosition.x, this.pixelPosition.y, Board.TILE_SIZE - 10, Board.TILE_SIZE - 10);
    }
  }

  move(x, y) {
    this.pixelPosition = createVector(
      x * Board.TILE_SIZE + (Board.TILE_SIZE / 2),
      y * Board.TILE_SIZE + (Board.TILE_SIZE / 2)
    );
    this.matrixPosition = createVector(x, y);
  }

  moveThroughPieces(x, y) {
    const stepDirectionX = x - this.matrixPosition.x > 0 ? 1 : x === this.matrixPosition.x ? 0 : -1;
    const stepDirectionY = y - this.matrixPosition.y > 0 ? 1 : y === this.matrixPosition.y ? 0 : -1;

    // If the piece gets placed in the same position as what it started out as,
    // then count that as moving through a piece, and that actually make sense I would say
    if (stepDirectionX === 0 && stepDirectionY === 0) return true;

    const tempPos = createVector(this.matrixPosition.x, this.matrixPosition.y);
    tempPos.x += stepDirectionX;
    tempPos.y += stepDirectionY;

    while(tempPos.x !== x || tempPos.y !== y) {
      if (board.getPiece(tempPos.x, tempPos.y)) return true;

      tempPos.x += stepDirectionX;
      tempPos.y += stepDirectionY;
    }
  }

  canMove(x, y) {
    // Don't move outside the board
    if (x >= 0 && y >= 0 && x <= 7 && y <= 7) {
      const piece = board.getPiece(x, y);

      // Don't move to a place where there is an ally
      // This might be a problem with "Rokade" ability
      if (piece) return piece.white !== this.white;
      // It's okay to move to a place where there is no pieces
      else return true;
    }
  }
}


class King extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite, Piece.generatePieceImgPath(isWhite, 'king.png'));
  }

  canMove(x, y) {
    if (super.canMove(x, y)) {
      return abs(x - this.matrixPosition.x) <= 1 && abs(y - this.matrixPosition.y) <= 1;
    }
  }
}

class Queen extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite, Piece.generatePieceImgPath(isWhite, 'queen.png'));
  }

  canMove(x, y) {
    if (super.canMove(x, y)) {
      const isMovingThroughPieces = this.moveThroughPieces(x, y);

      // Straight
      if ((x === this.matrixPosition.x || y === this.matrixPosition.y) && !isMovingThroughPieces) {
        return true;

      // Diagonal
      } else if (abs(x - this.matrixPosition.x) === abs(y - this.matrixPosition.y) && !isMovingThroughPieces) {
        return true;
      }
    }
  }
}

class Bishop extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite, Piece.generatePieceImgPath(isWhite, 'bishop.png'));
  }

  canMove(x, y) {
    if (super.canMove(x, y)) {
      const isMovingThroughPieces = this.moveThroughPieces(x, y);

      // Diagonal
      if (abs(x - this.matrixPosition.x) === abs(y - this.matrixPosition.y) && !isMovingThroughPieces) {
        return true;
      }
    }
  }
}

class Knight extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite, Piece.generatePieceImgPath(isWhite, 'knight.png'));
  }

  canMove(x, y) {
    if (super.canMove(x, y)) {
      const horizontalMovement = abs(x - this.matrixPosition.x) === 2 && abs(y - this.matrixPosition.y) === 1;
      const verticalMovement = abs(x - this.matrixPosition.x) === 1 && abs(y - this.matrixPosition.y) === 2;

      if (horizontalMovement || verticalMovement) return true;
    }
  }
}

class Rook extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite, Piece.generatePieceImgPath(isWhite, 'rook.png'));
  }

  canMove(x, y) {
    if (super.canMove(x, y)) {
      const isMovingThroughPieces = this.moveThroughPieces(x, y);

      // Straight
      if ((x === this.matrixPosition.x || y === this.matrixPosition.y) && !isMovingThroughPieces) {
        return true;
      }
    }
  }
}

class Pawn extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite, Piece.generatePieceImgPath(isWhite, 'pawn.png'));
    this.firstTurn = true;
  }

  canMove(x, y) {
    // TODO: Make "passant" functionality!
    if (super.canMove(x, y)) {

      const stepDirectionX = x - this.matrixPosition.x;
      const stepDirectionY = y - this.matrixPosition.y;

      const isWhiteAndMoveUp = this.white && stepDirectionY === -1;
      const isBlackAndMoveDown = !this.white && stepDirectionY === 1;

      // This is if the pawn is attacking a piece
      if (board.getPiece(x, y)) {
        const moveDiagonal = abs(stepDirectionX) === abs(stepDirectionY);
        
        if (moveDiagonal && (isWhiteAndMoveUp || isBlackAndMoveDown)) {
          this.firstTurn = false;
          return true;
        }
        // As long as the pawn hasn't moved horizontally we are good to go
      } else if (stepDirectionX === 0) {
        const isWhiteAndMove2Up = this.white && stepDirectionY === -2;
        const isBlackAndMove2Down = !this.white && stepDirectionY === 2;
        const isMovingThroughPieces = this.moveThroughPieces(x, y);

        // Move one field up
        if (isWhiteAndMoveUp || isBlackAndMoveDown) {
          this.firstTurn = false;
          return true;
        // Move two fields up only if it's the pieces first turn
        } else if (this.firstTurn && !isMovingThroughPieces && (isWhiteAndMove2Up || isBlackAndMove2Down)) {
          this.firstTurn = false;
          return true;
        }
      }
    }
  }
}
