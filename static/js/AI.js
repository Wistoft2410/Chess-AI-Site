class AI {
  minimax(position, depth, maximizingPlayer) {
    // TODO: Checking for endGame variable might not be the best choice
    if (depth === 0 || endGame) return this.evaluateBoardState();

    if (maximizingPlayer) {
      maxEvaluation = Number.NEGATIVE_INFINITY;

      for () {
      }
    } else {
      minEvaluation = Number.POSITIVE_INFINITY;

    }
  }

  evaluateBoardState() {
    return board.whiteScore - board.blackScore ;
  }
}
