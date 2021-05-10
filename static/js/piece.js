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

  canMove(x, y, skipKingCheck) {
    return (
      this.isInsideBoard(x, y) &&
      !this.isAllyAtLocation(x, y) &&
      !this.moveThroughPieces(x, y) &&
      (skipKingCheck || !board.isKingInCheck(this, x, y))
    );
  }

  isInsideBoard(x, y) {
    return x >= 0 && y >= 0 && x <= 7 && y <= 7;
  }

  isAllyAtLocation(x, y) {
    const piece = board.getPiece(x, y);

    return piece && piece.white === this.white;
  }

  moveThroughPieces(x, y) {
    const stepDirectionX = x - this.matrixPosition.x > 0 ? 1 : x === this.matrixPosition.x ? 0 : -1;
    const stepDirectionY = y - this.matrixPosition.y > 0 ? 1 : y === this.matrixPosition.y ? 0 : -1;

    // If the piece gets placed in the same position as what it started out as,
    // then count that as moving through a piece, and that actually makes sense I would say
    // I actually don't need to have this line since we always call this.isAllyAtLocation(x, y) 
    // before this method. We do it anyways though for the sake of more robustness and safety I guess! :)
    // And the thing is if we didn't return here we would probably run into an infinite loop later if we called
    // this method with no context and supplied it with some unfortunate parameters (x, y)!
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
}

// TODO: Make the king vulnerable to checkmate, so a player can lose and another can win!!
class King extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite, Piece.generatePieceImgPath(isWhite, 'king.png'));
    this.firstTurn = true;
  }

  canMove(x, y, skipKingCheck) {
    return this.castling(x, y) || this.normalMove(x, y, skipKingCheck);
  }

  castling(x, y) {
    if (this.isInsideBoard(x, y) && this.isAllyAtLocation(x, y)) {
      const piece = board.getPiece(x, y);
      const isRook = piece.constructor.name === "Rook";
      const isMovingThroughPieces = this.moveThroughPieces(x, y);
      const firstTurn = piece.firstTurn && this.firstTurn;

      if (!board.checked(this) && isRook && firstTurn && !isMovingThroughPieces) {
        const isRightSide = piece.matrixPosition.x > this.matrixPosition.x;
        const stepDirectionX1 = isRightSide ? 1 : -1;
        const stepDirectionX2 = isRightSide ? 2 : -2;

        // I don't need to use the skipKingCheck parameter here because the king would
        // never make a castle move to try to attack an enemy piece (enemy king piece) xD
        const areTilesInCheck = (
          board.isInCheck(this, this.matrixPosition.x + stepDirectionX1, this.matrixPosition.y) ||
          board.isInCheck(this, this.matrixPosition.x + stepDirectionX2, this.matrixPosition.y)
        );

        return !areTilesInCheck;
      }
    }
  }

  normalMove(x, y, skipKingCheck) {
    if (this.isInsideBoard(x, y) && !this.isAllyAtLocation(x, y) && (skipKingCheck || !board.isInCheck(this, x, y))) {
      return abs(x - this.matrixPosition.x) <= 1 && abs(y - this.matrixPosition.y) <= 1;
    }
  }

  move(x, y) {
    // Here we perform castling.
    // Maybe all of this should be handled by the board class, but
    // I thought that it would be better for the King class to handle
    // this since it's the King you have to move and initate castling in 
    // this game version of chess!
    if (this.castling(x, y)) {
      const rook = board.getPiece(x, y);
      const isRightSide = rook.matrixPosition.x > this.matrixPosition.x;
      const kingStepDirectionX = isRightSide ? 2 : -2;
      const rookStepDirectionX = isRightSide ? blackOrWhite ? -2 : -3 : blackOrWhite ? 3 : 2;

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

  canMove(x, y, skipKingCheck) {
    if (super.canMove(x, y, skipKingCheck)) {

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

  canMove(x, y, skipKingCheck) {
    if (super.canMove(x, y, skipKingCheck)) {

      // Diagonal
      return abs(x - this.matrixPosition.x) === abs(y - this.matrixPosition.y);
    }
  }
}

class Knight extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite, Piece.generatePieceImgPath(isWhite, 'knight.png'));
  }

  canMove(x, y, skipKingCheck) {
    if (this.isInsideBoard(x, y) && !this.isAllyAtLocation(x, y) && (skipKingCheck || !board.isKingInCheck(this, x, y))) {
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

  canMove(x, y, skipKingCheck) {
    if (super.canMove(x, y, skipKingCheck)) {

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
    this.passantVulnerability = false;
    this.promotionPosition = blackOrWhite ? this.white ? 0 : 7 : !this.white ? 0 : 7;
  }

  canMove(x, y, skipKingCheck) {
    if (super.canMove(x, y, skipKingCheck)) {
      return this.normalAttack(x, y) || this.passantAttack(x, y) || this.moveOneField(x, y) || this.moveTwoFields(x, y);
    }
  }

  // TODO: clean these methods up!!!
  normalAttack(x, y) {
    const playerWhiteDirection = blackOrWhite ? -1 : 1;
    const playerBlackDirection = !blackOrWhite ? -1 : 1;

    const stepDirectionX = x - this.matrixPosition.x;
    const stepDirectionY = y - this.matrixPosition.y;

    const isWhiteAndCorrectDirection1 = this.white && stepDirectionY === playerWhiteDirection;
    const isBlackAndCorrectDirection1 = !this.white && stepDirectionY === playerBlackDirection;

    const moveDiagonal = abs(stepDirectionX) === abs(stepDirectionY);

    if (moveDiagonal && (isWhiteAndCorrectDirection1 || isBlackAndCorrectDirection1)) {
      return !!board.getPiece(x, y);
    }
  }

  passantAttack(x, y) {
    const playerWhiteDirection = blackOrWhite ? -1 : 1;
    const playerBlackDirection = !blackOrWhite ? -1 : 1;

    const stepDirectionX = x - this.matrixPosition.x;
    const stepDirectionY = y - this.matrixPosition.y;

    const isWhiteAndCorrectDirection1 = this.white && stepDirectionY === playerWhiteDirection;
    const isBlackAndCorrectDirection1 = !this.white && stepDirectionY === playerBlackDirection;

    const moveDiagonal = abs(stepDirectionX) === abs(stepDirectionY);

    if (moveDiagonal && (isWhiteAndCorrectDirection1 || isBlackAndCorrectDirection1)) {
      const pawn = board.findPassantVulnerablePawn();

      if (pawn) {
        const isOnTheSameXaxis = x === pawn.matrixPosition.x;
        const madeAPassantMove = y - pawn.matrixPosition.y === (this.white ? playerWhiteDirection : playerBlackDirection);

        // This is if the pawn makes a passant attack
        return isOnTheSameXaxis && madeAPassantMove;
      }
    }
  }

  moveOneField(x, y) {
    const playerWhiteDirection = blackOrWhite ? -1 : 1;
    const playerBlackDirection = !blackOrWhite ? -1 : 1;

    const stepDirectionX = x - this.matrixPosition.x;
    const stepDirectionY = y - this.matrixPosition.y;

    const isWhiteAndCorrectDirection1 = this.white && stepDirectionY === playerWhiteDirection;
    const isBlackAndCorrectDirection1 = !this.white && stepDirectionY === playerBlackDirection;

    if (stepDirectionX === 0 && !board.getPiece(x, y)) {
      return isWhiteAndCorrectDirection1 || isBlackAndCorrectDirection1;
    }
  }

  moveTwoFields(x, y) {
    const playerWhiteDirection = blackOrWhite ? -1 : 1;
    const playerBlackDirection = !blackOrWhite ? -1 : 1;

    const stepDirectionX = x - this.matrixPosition.x;
    const stepDirectionY = y - this.matrixPosition.y;

    const isWhiteAndCorrectDirection2 = this.white && stepDirectionY === playerWhiteDirection * 2;
    const isBlackAndCorrectDirection2 = !this.white && stepDirectionY === playerBlackDirection * 2;

    if (stepDirectionX === 0 && !board.getPiece(x, y)) {
      return this.firstTurn && (isWhiteAndCorrectDirection2 || isBlackAndCorrectDirection2);
    }
  }

  move(x, y) {
    if (this.moveTwoFields(x, y)) this.passantVulnerability = true;
    if (this.passantAttack(x, y)) board.findPassantVulnerablePawn().captured = true;

    // We don't want to call super.move(x, y) at the beginning of this method since
    // we don't want to change this piece's location before we check for things such
    // as passantVulnerability among other things!
    super.move(x, y);

    // If the pawn is at the opposite side of the board then promote it
    if (y === this.promotionPosition) this.promoted = true;
    if (this.firstTurn) this.firstTurn = false;
  }
}
