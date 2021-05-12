class AI {
  minimax(position, depth, maximizingPlayer) {
    // TODO: Checking for endGame variable might not be the best choice
    if (depth === 0 || endGame) return this.evaluateBoardState();

    if (maximizingPlayer) {
      maxEvaluation = Number.NEGATIVE_INFINITY;

      //for () {
      //}

    } else {
      minEvaluation = Number.POSITIVE_INFINITY;

    }
  }

  evaluateBoardState() {
    return board.whiteScore - board.blackScore;
  }
}

class SimulationBoard extends Board {
  constructor() {
    this.whiteScore = 1290;
    this.blackScore = 1290;
  }

  run() {
    super.run();
    calculateScores();
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
