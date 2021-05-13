class AI {
  minimax(board, depth, maximizingPlayer) {
    if (depth === 0 || board.checkmate) return this.evaluateBoardState(board);

    if (maximizingPlayer) {
      maxEvaluation = Number.NEGATIVE_INFINITY;
    } else {
      minEvaluation = Number.POSITIVE_INFINITY;
    }
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
    this.whiteScore = this.pieces.filter(piece => piece.white).reduce(this.reduceFunction);
    this.blackScore = this.pieces.filter(piece => !piece.white).reduce(this.reduceFunction);
  }

  reduceFunction(total, piece) {
    const previousValue = typeof total === 'object' ? total.materialScore : total;
    return previousValue + piece.materialScore;
  }
}
