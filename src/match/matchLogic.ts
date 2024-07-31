export class MatchLogic {
  private static WINNING_SCORE = 21;

  static calculateRoundScore(
    teamAScore: number,
    teamBScore: number,
  ): { scoreA: number; scoreB: number } {
    const scoreDifference = teamAScore - teamBScore;
    if (scoreDifference > 0) {
      return { scoreA: scoreDifference, scoreB: 0 };
    } else if (scoreDifference < 0) {
      return { scoreA: 0, scoreB: -scoreDifference };
    }
    return { scoreA: 0, scoreB: 0 };
  }

  static updateMatchScore(
    currentScoreA: number,
    currentScoreB: number,
    roundScoreA: number,
    roundScoreB: number,
  ): { newScoreA: number; newScoreB: number; winnerId: number | null } {
    const newScoreA = currentScoreA + roundScoreA;
    const newScoreB = currentScoreB + roundScoreB;

    let winnerId = null;
    if (newScoreA >= this.WINNING_SCORE) {
      winnerId = 1; // Assuming 1 represents teamA
    } else if (newScoreB >= this.WINNING_SCORE) {
      winnerId = 2; // Assuming 2 represents teamB
    }

    return { newScoreA, newScoreB, winnerId };
  }

  static validateRound(
    roundNumber: number,
    teamAScore: number,
    teamBScore: number,
  ): boolean {
    if (roundNumber <= 0) {
      throw new Error('Round number must be positive');
    }
    if (teamAScore < 0 || teamBScore < 0) {
      throw new Error('Scores cannot be negative');
    }
    if (teamAScore > 12 || teamBScore > 12) {
      throw new Error('Maximum score per round is 12 (4 bags * 3 points)');
    }
    return true;
  }
}
