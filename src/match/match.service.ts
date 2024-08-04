import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// import { MatchLogic } from './matchLogic';

@Injectable()
export class MatchService {
  constructor(private prisma: PrismaService) {}

  async createMatch(teamAId: number, teamBId: number, stageId?: number) {
    const newMatch = await this.prisma.match.create({
      data: {
        teamAId,
        teamBId,
        stageId,
        scoreA: 0,
        scoreB: 0,
      },
      include: {
        teamA: true,
        teamB: true,
        stage: true,
      },
    });

    return newMatch;
  }

  async getMatches(stageId?: number) {
    const matches = await this.prisma.match.findMany({
      where: stageId ? { stageId } : {},
      include: {
        teamA: true,
        teamB: true,
        stage: true,
      },
    });

    return matches;
  }

  async addRound(matchId: number) {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) throw new Error('Match not found');

    if (match.status === 'COMPLETED' || match.status === 'SCHEDULED') {
      throw new Error('Match is either completed or scheduled');
    }

    await this.prisma.matchRound.create({
      data: {
        matchId,
        roundNumber: match.currentRound + 1,
      },
    });
  }
}
