class Piece {
  constructor(x, y, isWhite, letter) {
    this.matrixPosition = createVector(x, y);
    this.pixelPosition = createVector(x*tileSize + (tileSize/2), y*tileSize + (tileSize/2));

    this.taken = false;
    this.white = isWhite;
    this.letter = letter;
  }

  show() {
    // This is for later
    if (this.isWhite) {
      //fill(255);
    } else {
      //fill(0);
    }

    // This is just temporary
    textSize(30);
    textAlign(CENTER, CENTER);
    fill(100);
    text(this.letter, this.pixelPosition.x, this.pixelPosition.y);
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
