import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TournamentService {
  constructor(private prisma: PrismaService) {}

  async createTournament(name: string, leagueId: number) {
    return this.prisma.tournament.create({
      data: { name, leagueId },
    });
  }

  async getTournaments() {
    return this.prisma.tournament.findMany({
      include: { league: true },
    });
  }
}
