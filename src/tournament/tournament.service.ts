import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BracketType, MatchStatus } from '@prisma/client';

@Injectable()
export class TournamentService {
  constructor(private prisma: PrismaService) {}

  async createTournament(name: string, leagueId: number) {
    return this.prisma.tournament.create({
      data: { name, leagueId },
    });
  }

  async addStage(tournamentId: number, bracketType: BracketType, name: string) {
    const stage = await this.prisma.stage.create({
      data: { name, tournamentId, bracketType },
    });
    return stage;
  }

  async getTournament(tournamentId: number) {
    return this.prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: { league: true, stages: true },
    });
  }

  async getTournaments() {
    return this.prisma.tournament.findMany({
      include: { league: true, stages: true },
    });
  }

  async startTournament(tournamentId: number) {
    const tournament = await this.prisma.tournament.update({
      where: { id: tournamentId },
      data: { status: MatchStatus.IN_PROGRESS },
    });

    return tournament;
  }
}
