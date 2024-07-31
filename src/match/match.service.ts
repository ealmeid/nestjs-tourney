import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MatchLogic } from './matchLogic';

@Injectable()
export class MatchService {
  constructor(private prisma: PrismaService) {}

  async createMatch(teamAId: number, teamBId: number, tournamentId?: number) {
    return this.prisma.match.create({
      data: {
        teamAId,
        teamBId,
        tournamentId,
        scoreA: 0,
        scoreB: 0,
      },
      include: {
        teamA: true,
        teamB: true,
        tournament: true,
      },
    });
  }

  async getMatches(tournamentId?: number) {
    return this.prisma.match.findMany({
      where: tournamentId ? { tournamentId } : {},
      include: {
        teamA: true,
        teamB: true,
        tournament: true,
        rounds: true,
      },
    });
  }

  async addRound(
    matchId: number,
    roundNumber: number,
    teamAScore: number,
    teamBScore: number,
  ) {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
    });
    if (!match) throw new Error('Match not found');

    MatchLogic.validateRound(roundNumber, teamAScore, teamBScore);

    const roundScore = MatchLogic.calculateRoundScore(teamAScore, teamBScore);
    const { newScoreA, newScoreB, winnerId } = MatchLogic.updateMatchScore(
      match.scoreA,
      match.scoreB,
      roundScore.scoreA,
      roundScore.scoreB,
    );

    await this.prisma.round.create({
      data: {
        matchId,
        roundNumber,
        teamAScore,
        teamBScore,
      },
    });

    return this.prisma.match.update({
      where: { id: matchId },
      data: {
        scoreA: newScoreA,
        scoreB: newScoreB,
        winnerId: winnerId
          ? winnerId === 1
            ? match.teamAId
            : match.teamBId
          : null,
      },
    });
  }
}
