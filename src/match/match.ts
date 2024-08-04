import { v4 as uuidv4 } from 'uuid';

interface Matchup {
  teamAPlayerId: string;
  teamBPlayerId: string;
}

interface MatchState {
  id: string;

  currentRound: number;
  currentScore: { teamA: number; teamB: number };

  teamAId: string;
  teamBId: string;

  matchups: [Matchup, Matchup] | null;
  startingMatchupIndex: number | null;

  isComplete: boolean;
}

interface MatchConfig {
  winningScore: number;
  roundLimit: number;
}

export class Match {
  private state: MatchState;
  private readonly config: MatchConfig;

  private constructor(state: MatchState, config?: MatchConfig) {
    this.state = state;
    this.config = config ?? { winningScore: 21, roundLimit: 10 };
  }

  static create(teamAId: string, teamBId: string): Match {
    return new Match({
      id: uuidv4(),
      teamAId,
      teamBId,
      matchups: null,
      startingMatchupIndex: null,
      currentRound: 0,
      currentScore: { teamA: 0, teamB: 0 },
      isComplete: false,
    });
  }

  setMatchups(matchups: [Matchup, Matchup]): void {
    if (this.state.matchups) {
      throw new Error('Matchups have already been set');
    }
    this.state.matchups = matchups;
  }

  setStartingMatchup(index: 0 | 1): void {
    if (this.state.startingMatchupIndex !== null) {
      throw new Error('Starting matchup has already been set');
    }
    if (!this.state.matchups) {
      throw new Error(
        'Matchups must be set before setting the starting matchup',
      );
    }
    this.state.startingMatchupIndex = index;
  }

  createRound(): void {
    if (this.state.currentRound >= this.config.roundLimit) {
      throw new Error('Match has reached round limit');
    }

    if (this.state.isComplete) {
      throw new Error('Cannot add round to a completed match');
    }

    if (this.state.startingMatchupIndex === null) {
      throw new Error('Starting matchup must be set before adding rounds');
    }

    this.state.currentRound++;
  }

  getCurrentMatchup(): Matchup {
    if (!this.state.matchups || this.state.startingMatchupIndex === null) {
      throw new Error(
        'Matchups and starting matchup must be set before getting current matchup',
      );
    }
    return this.state.matchups[
      (this.state.startingMatchupIndex + this.state.currentRound) % 2
    ];
  }

  getState(): Readonly<MatchState> {
    return { ...this.state };
  }

  getConfig(): Readonly<MatchConfig> {
    return { ...this.config };
  }
}
