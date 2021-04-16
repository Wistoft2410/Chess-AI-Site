class Piece {
  constructor(x, y, isWhite, letter) {
    this.matrixPosition = createVector(x, y);
    this.pixelPosition = createVector(x * TILE_SIZE + (TILE_SIZE / 2), y * TILE_SIZE + (TILE_SIZE / 2));

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
    this.matrixPosition = createVector(x, y);
    this.pixelPosition = createVector(x * TILE_SIZE + (TILE_SIZE / 2), y * TILE_SIZE + (TILE_SIZE / 2));
  }
}


class King extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite, "K");
  }
}

class Queen extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite, "Q");
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
