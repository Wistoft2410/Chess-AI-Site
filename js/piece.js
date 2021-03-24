class Piece {
  constructor(x, y, isWhite) {
    this.matrixPosition = createVector(x, y);
    this.pixelPosition = createVector(x*tileSize, y*tileSize);

    this.taken = false;
    this.white = isWhite;

  }

  // Subclasses should override these methods
  show() {}
  show() {}

}


class King extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite);
  }

  show() {
    text("K", pixelPosition.x, pixelPosition.y);
  }
}
