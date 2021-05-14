class AI {
  constructor() {
    // Global board state to keep track of the
    // real board state that the player sees
    this.board = new SimulationBoard();
  }

  calculateBestMove() {
    const moveArr = this.minimax(this.board, difficulty, !blackOrWhite)[0];
    const piece = this.board.getPiece(moveArr[0].x, moveArr[0].y);
    piece.move(moveArr[1].x, moveArr[1].y);
    this.board.run(blackOrWhite);

    return moveArr;
  }

  // We've come to the conclusion that we should deep clone the SimulationBoard class instances,
  // with every new move during the simulation in the minimax algorithm because that is way easier
  // than defining some "undo" move method on the class. Yes the performance might not be
  // the best but from a maintainability point of view this is pretty good!
  // maximizingPlayer when true is indicating white player and false is indicating black player
  minimax(board, depth, maximizingPlayer) {
    if (depth === 0 || board.checkmate) return [null, this.evaluateBoardState(board)];

    let bestMove = null;

    if (maximizingPlayer) {
      let maxEvaluation = Number.NEGATIVE_INFINITY;

      for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
          for (let piece of board.pieces.filter(piece => piece.white)) {
            if (piece.canMove(x, y, false)) {
              const childBoard = _.cloneDeep(board);
              const pieceToMove = childBoard.pieces.find(childPiece => childPiece.matrixPosition.equals(piece.matrixPosition));

              // Save the original positioin (location)
              const originalPosition = pieceToMove.matrixPosition.copy();

              pieceToMove.move(x, y);
              childBoard.run(false);

              const evaluation = this.minimax(childBoard, depth - 1, false)[1];

              if (evaluation > maxEvaluation) {
                maxEvaluation = evaluation;
                bestMove = [originalPosition, createVector(x, y)];
              }
            }
          }
        }
      }

      return [bestMove, maxEvaluation];
    } else {
      let minEvaluation = Number.POSITIVE_INFINITY;

      for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
          for (let piece of board.pieces.filter(piece => !piece.white)) {
            if (piece.canMove(x, y, false)) {
              const childBoard = _.cloneDeep(board);
              const pieceToMove = childBoard.pieces.find(childPiece => childPiece.matrixPosition.equals(piece.matrixPosition));

              // Save the original positioin (location)
              const originalPosition = pieceToMove.matrixPosition.copy();

              pieceToMove.move(x, y);
              childBoard.run(true);

              const evaluation = this.minimax(childBoard, depth - 1, true)[1];

              if (evaluation < minEvaluation) {
                minEvaluation = evaluation;
                bestMove = [originalPosition, createVector(x, y)];
              }
            }
          }
        }
      }

      return [bestMove, minEvaluation];
    }
  }

  evaluateBoardState(board) {
    return board.whiteScore - board.blackScore;
  }

  // This method is used for the global "this.board" variable in this class (AI class)
  setup(location, destination, whitesMove) {
    const piece = this.board.getPiece(location.x, location.y);
    piece.move(destination.x, destination.y);
    this.board.run(whitesMove);
  }
}

class SimulationBoard extends Board {
  constructor() {
    super();
    this.whiteScore;
    this.blackScore;
    this.calculateScores();
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
    if (this.checkmate) this.pieces = this.pieces.filter(piece => piece.white !== whitesMove || piece.constructor.name !== "King");
  }

  calculateScores() {
    this.whiteScore = this.pieces.filter(piece => piece.white).reduce(this.materialScoreAccumulator);
    this.blackScore = this.pieces.filter(piece => !piece.white).reduce(this.materialScoreAccumulator);
  }

  materialScoreAccumulator(total, piece) {
    const previousValue = typeof total === 'object' ? total.materialScore : total;
    return previousValue + piece.materialScore;
  }
}
