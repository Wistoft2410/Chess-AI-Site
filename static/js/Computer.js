class AI {
  constructor() {
    // Global board state to keep track of the
    // real board state that the player sees
    this.board = new SimulationBoard();
  }

  // This method is used for the global "this.board" variable in this class (AI class)
  setup(location, destination, whitesMove) {
    const piece = this.board.getPiece(location.x, location.y);
    piece.move(destination.x, destination.y);

    this.board.run(whitesMove);
  }

  calculateMove(whitesMove) {
    const moveInfo = this.minimax(this.board, difficulty, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, whitesMove)[1];
    const location = moveInfo[0];
    const destination = moveInfo[1];

    this.setup(location, destination, !whitesMove);

    return [location, destination];
  }

  // We've come to the conclusion that we should deep clone the SimulationBoard class instances,
  // with every new move during the simulation in the minimax algorithm because that is way easier
  // than defining some "undo" move method on the class. Yes the performance might not be
  // the best, but from a maintainability point of view this is pretty good!
  // maximizingPlayer when true is indicating white player and false is indicating black player
  minimax(board, depth, alpha, beta, maximizingPlayer) {
    if (depth === 0 || board.checkmate) return [this.evaluateBoardState(board)];

    let bestMove = null;

    if (maximizingPlayer) {
      let maxEvaluation = Number.NEGATIVE_INFINITY;

      outerLoop:
      for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
          for (let piece of board.pieces.filter(piece => piece.white)) {
            if (piece.canMove(x, y, false)) {

              const moveInfo = this.computeMove(board, piece, x, y, depth, alpha, beta, false);

              if (moveInfo[0] > maxEvaluation) {
                maxEvaluation = moveInfo[0];
                bestMove = [moveInfo[1], createVector(x, y)];
              }

              if (moveInfo[0] > alpha) alpha = moveInfo[0];
              if (beta <= alpha) break outerLoop;
            }
          }
        }
      }

      return [maxEvaluation, bestMove];
    } else {
      let minEvaluation = Number.POSITIVE_INFINITY;

      outerLoop:
      for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
          for (let piece of board.pieces.filter(piece => !piece.white)) {
            if (piece.canMove(x, y, false)) {

              const moveInfo = this.computeMove(board, piece, x, y, depth, alpha, beta, true);

              if (moveInfo[0] < minEvaluation) {
                minEvaluation = moveInfo[0];
                bestMove = [moveInfo[1], createVector(x, y)];
              }

              if (moveInfo[0] < beta) beta = moveInfo[0];
              if (beta <= alpha) break outerLoop;
            }
          }
        }
      }

      return [minEvaluation, bestMove];
    }
  }

  computeMove(board, piece, x, y, depth, alpha, beta, maximizingPlayer) {
    const childBoard = _.cloneDeep(board);
    const pieceToMove = childBoard.pieces.find(childPiece => childPiece.matrixPosition.equals(piece.matrixPosition));

    // Save the location (original position)
    const location = pieceToMove.matrixPosition.copy();

    pieceToMove.move(x, y);
    childBoard.run(maximizingPlayer);

    const evaluation = this.minimax(childBoard, depth - 1, alpha, beta, maximizingPlayer)[0];

    return [evaluation, location];
  }

  evaluateBoardState(board) {
    return board.whiteScore - board.blackScore;
  }
}

class SimulationBoard extends Board {
  constructor() {
    super();
    this.whiteScore;
    this.blackScore;
  }

  run(whitesMove) {
    super.run(whitesMove);
    this.calculateScores();
  }

  checkMate(whitesMove) {
    super.checkMate(whitesMove);
    // The AI has no idea if checkmate is a good idea or a bad idea, so what we do is we remove the King
    // from the board to indicate it has been captured (checkmated) which resolves in the highest loss in 
    // piece value. By doing this we make sure that the AI is aware of the danger and greatness of checkmate!
    if (this.checkmate) this.pieces = this.pieces.filter(piece => (
      piece.white !== whitesMove ||
      piece.constructor.name !== "King"
    ));
  }

  calculateScores() {
    const whitePieces = this.pieces.filter(piece => piece.white);
    const blackPieces = this.pieces.filter(piece => !piece.white);

    this.whiteScore = whitePieces.length ? whitePieces.reduce(this.materialScoreAccumulator) : 0;
    this.blackScore = blackPieces.length ? blackPieces.reduce(this.materialScoreAccumulator) : 0;
  }

  materialScoreAccumulator(total, piece) {
    const previousValue = typeof total === 'object' ? total.materialScore : total;
    return previousValue + piece.materialScore;
  }
}
