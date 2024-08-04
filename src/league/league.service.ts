import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LeagueService {
  constructor(private prisma: PrismaService) {}

  async createLeague(name: string, description?: string) {
    const league = await this.prisma.league.create({
      data: { name, description },
    });

    return league;
  }

  async getLeagues() {
    return this.prisma.league.findMany({
      include: { tournaments: true },
    });
  }
}
