class Piece {
  constructor(x, y, isWhite, image) {
    this.matrixPosition = createVector(x, y);
    this.pixelPosition = createVector(
      x * Board.TILE_SIZE + (Board.TILE_SIZE / 2),
      y * Board.TILE_SIZE + (Board.TILE_SIZE / 2)
    );

    this.captured = false;
    this.moving = false;
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
    // If there is a piece at the location, then capture it!
    const piece = board.getPiece(x, y);
    if (piece) piece.captured = true;

    this.matrixPosition.set(x, y);
    this.pixelPosition.set(
      x * Board.TILE_SIZE + (Board.TILE_SIZE / 2),
      y * Board.TILE_SIZE + (Board.TILE_SIZE / 2)
    );
  }

  canMove(x, y) {
    return (
      this.isInsideBoard(x, y) &&
      !this.isAllyAtLocation(x, y) &&
      !this.moveThroughPieces(x, y) &&
      !board.isKingInCheck(this.white)
    );
  }

  moveThroughPieces(x, y) {
    const stepDirectionX = x - this.matrixPosition.x > 0 ? 1 : x === this.matrixPosition.x ? 0 : -1;
    const stepDirectionY = y - this.matrixPosition.y > 0 ? 1 : y === this.matrixPosition.y ? 0 : -1;

    // If the piece gets placed in the same position as what it started out as,
    // then count that as moving through a piece, and that actually makes sense I would say
    if (stepDirectionX === 0 && stepDirectionY === 0) return true;

    const tempPos = this.matrixPosition.copy();
    tempPos.x += stepDirectionX;
    tempPos.y += stepDirectionY;

    // We call isInsideBoard() because we don't want to do a search indefinitely outside the board!
    while((tempPos.x !== x || tempPos.y !== y) && this.isInsideBoard(tempPos.x, tempPos.y)) {
      if (board.getPiece(tempPos.x, tempPos.y)) return true;

      tempPos.x += stepDirectionX;
      tempPos.y += stepDirectionY;
    }
  }

  isInsideBoard(x, y) {
    return x >= 0 && y >= 0 && x <= 7 && y <= 7;
  }

  isAllyAtLocation(x, y) {
    const piece = board.getPiece(x, y);

    return piece && piece.white === this.white;
  }
}

class King extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite, Piece.generatePieceImgPath(isWhite, 'king.png'));
    this.check = false;
    this.firstTurn = true;
    this.kingside = false;
    this.queenside = false;
  }

  // This method is impure since we are setting external boolean variables.
  // A way to fix that would be to extract the method into smaller methods
  // and then calling them twice (once in the canMove() method and once in the move() method)
  canMove(x, y) {
    if (this.isInsideBoard(x, y)) {
      // Castling!
      // There are probably many different ways to actually perform castling,
      // especially in the real world xD
      // But in this specific game the only way to perform castling is by
      // moving the king over to a rook's current position (starting position)!
      if (this.isAllyAtLocation(x, y)) {
        const piece = board.getPiece(x, y);
        const isRook = piece.constructor.name === "Rook";
        const isMovingThroughPieces = this.moveThroughPieces(x, y);
        const firstTurn = piece.firstTurn && this.firstTurn;

        if (!this.check && isRook && firstTurn && !isMovingThroughPieces) {
          const kingside = piece.matrixPosition.x > this.matrixPosition.x;
          const stepDirectionX1 = kingside ? 1 : -1;
          const stepDirectionX2 = kingside ? 2 : -2;

          const areTilesInCheck = (
            board.isInCheck(this, this.matrixPosition.x + stepDirectionX1, this.matrixPosition.y) ||
            board.isInCheck(this, this.matrixPosition.x + stepDirectionX2, this.matrixPosition.y)
          );

          if (!areTilesInCheck) {
            // Here is where we are setting external variables which makes this method impure sadly
            this.kingside = kingside;
            this.queenside = !kingside
            return true;
          }
        }
      } else if (!board.isInCheck(this, x, y)) {
        return abs(x - this.matrixPosition.x) <= 1 && abs(y - this.matrixPosition.y) <= 1;
      }
    }
  }

  move(x, y) {
    // Here we perform castling.
    // Maybe all of this should be handled by the board class, but
    // I thought that it would be better for the King class to handle
    // this since it's the King you have to move and initate castling in 
    // this game version of chess!
    if (this.firstTurn && (this.kingside || this.queenside)) {
      const rook = board.getPiece(x, y);
      const kingStepDirectionX = this.kingside ? 2 : -2;
      const rookStepDirectionX = this.kingside ? -2 : 3;

      super.move(this.matrixPosition.x + kingStepDirectionX, this.matrixPosition.y);
      rook.move(rook.matrixPosition.x + rookStepDirectionX, rook.matrixPosition.y);

      // If we are not trying to castle then just move normally
    } else super.move(x, y);

    if (this.firstTurn) this.firstTurn = false;
  }
}

class Queen extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite, Piece.generatePieceImgPath(isWhite, 'queen.png'));
  }

  canMove(x, y) {
    if (super.canMove(x, y)) {

      // Straight
      if (x === this.matrixPosition.x || y === this.matrixPosition.y) {
        return true;

        // Diagonal
      } else if (abs(x - this.matrixPosition.x) === abs(y - this.matrixPosition.y)) {
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

      // Diagonal
      return abs(x - this.matrixPosition.x) === abs(y - this.matrixPosition.y);
    }
  }
}

class Knight extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite, Piece.generatePieceImgPath(isWhite, 'knight.png'));
  }

  canMove(x, y) {
    if (this.isInsideBoard(x, y) && !this.isAllyAtLocation(x, y) && !board.isKingInCheck(this.white)) {
      const horizontalMovement = abs(x - this.matrixPosition.x) === 2 && abs(y - this.matrixPosition.y) === 1;
      const verticalMovement = abs(x - this.matrixPosition.x) === 1 && abs(y - this.matrixPosition.y) === 2;

      return horizontalMovement || verticalMovement;
    }
  }
}

class Rook extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite, Piece.generatePieceImgPath(isWhite, 'rook.png'));
    this.firstTurn = true;
  }

  canMove(x, y) {
    if (super.canMove(x, y)) {

      // Straight
      return x === this.matrixPosition.x || y === this.matrixPosition.y;
    }
  }

  move(x, y) {
    super.move(x, y);
    if (this.firstTurn) this.firstTurn = false;
  }
}

class Pawn extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite, Piece.generatePieceImgPath(isWhite, 'pawn.png'));
    this.promoted = false;
    this.firstTurn = true;
    this.passantAttack = false;
    this.passantVulnerability = false;
  }

  // We've made lots of boolean variables to make it easier to read what we are testing for!
  // This method is sadly not 100% pure; it has some side effects in the form of setting
  // some external boolean variables on the class itself instead of just returning true.
  // This method could look a bit better!
  // One way to make this method pure is to extract parts of this method into smaller methods
  // and then calling them as required in the move method to e.g. find out if the pawn made a
  // passant attack or it became vulnerable to a passant attack! Doing this means that we would
  // call these smaller methods two times (one in canMove() method and one in move() method),
  // which is totally fine!
  canMove(x, y) {
    if (super.canMove(x, y)) {
      const stepDirectionX = x - this.matrixPosition.x;
      const stepDirectionY = y - this.matrixPosition.y;

      const isWhiteAndMoveUp = this.white && stepDirectionY === -1;
      const isBlackAndMoveDown = !this.white && stepDirectionY === 1;

      const moveDiagonal = abs(stepDirectionX) === abs(stepDirectionY);

      // This is if the pawn is attacking a piece
      if (moveDiagonal && (isWhiteAndMoveUp || isBlackAndMoveDown)) {
        if (board.getPiece(x, y)) return true;
        else {
          const pawn = board.findPassantVulnerablePawn();

          if (pawn) {
            const isOnTheSameXaxis = x === pawn.matrixPosition.x;
            const madeAPassantMove = y - pawn.matrixPosition.y === (this.white ? -1 : 1);

            // This is if the pawn makes a passant attack
            if (isOnTheSameXaxis && madeAPassantMove) {
              // This is an example of setting an exsternal variable which makes the method impure.
              // We set this variable because we want to indicate if the pawn has made a passant attack move.
              // I don't know where else I should put this line sadly
              this.passantAttack = true;
              return true
            }
          }
        }
        // As long as the pawn hasn't moved horizontally and there isn't a piece at the location (x, y),
        // we are good to go. Remember that a pawn can't capture a piece in front of it,
        // it can only do that diagonally
      } else if (stepDirectionX === 0 && !board.getPiece(x, y)) {
        const isWhiteAndMove2Up = this.white && stepDirectionY === -2;
        const isBlackAndMove2Down = !this.white && stepDirectionY === 2;

        // Move one field up
        if (isWhiteAndMoveUp || isBlackAndMoveDown) {
          return true;
          // Move two fields up only if it's the piece's first turn
        } else if (this.firstTurn && (isWhiteAndMove2Up || isBlackAndMove2Down)) {
          // This is an example of setting an exsternal variable which makes the method impure.
          // Make the piece vulnerable to a passant attack, not sure if this is the right place
          // to have the line though, but I don't know any other places to put the line
          this.passantVulnerability = true;
          return true;
        }
      }
    }
  }

  move(x, y) {
    super.move(x, y);
    if (this.firstTurn) this.firstTurn = false;

    // If the pawn is at the opposite side of the board then promote it
    if (this.white && y === 0 || !this.white && y === 7) this.promoted = true;

    // If the pawn made a passant move then capture the pawn that was "passant" attacked!
    if (this.passantAttack) board.findPassantVulnerablePawn().captured = true;
  }
}
