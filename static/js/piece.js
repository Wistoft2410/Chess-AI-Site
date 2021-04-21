class Piece {
  constructor(x, y, isWhite, letter) {
    this.pixelPosition = createVector(x * TILE_SIZE + (TILE_SIZE / 2), y * TILE_SIZE + (TILE_SIZE / 2));
    this.matrixPosition = createVector(x, y);

    this.moving = false;
    this.taken = false;
    this.white = isWhite;
    this.letter = letter;
  }

  show() {
    // This is for differentiating between the white and black pieces
    if (this.isWhite) {
      // Not sure how to do this, probably jsut wait till we have images instead of text
      //fill(255);
    } else {
      // Not sure how to do this, probably jsut wait till we have images instead of text
      //fill(0);
    }

    // --- THIS IS JUST TEMPORARY ---
    textSize(30);
    textAlign(CENTER, CENTER);
    fill(100);

    // Move with the mouse pointer
    if (this.moving) text(this.letter, mouseX, mouseY);
    else text(this.letter, this.pixelPosition.x, this.pixelPosition.y);
  }

  move(x, y) {
    this.pixelPosition = createVector(x * TILE_SIZE + (TILE_SIZE / 2), y * TILE_SIZE + (TILE_SIZE / 2));
    this.matrixPosition = createVector(x, y);
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
    super(x, y, isWhite, "K");
  }

  canMove(x, y) {
    if (super.canMove(x, y)) {
      return abs(x - this.matrixPosition.x) <= 1 && abs(y - this.matrixPosition.y) <= 1;
    }
  }
}

class Queen extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite, "Q");
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
    super(x, y, isWhite, "B");
  }
}

class Knight extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite, "Kn");
  }
}

class Rook extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite, "R");
  }
}

class Pawn extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite, "P");
  }
}
