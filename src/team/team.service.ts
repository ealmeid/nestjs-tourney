import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) {}

  async createTeam(name: string, playerIds: number[]) {
    return this.prisma.team.create({
      data: {
        name,
        players: {
          create: playerIds.map((playerId) => ({ playerId })),
        },
      },
      include: {
        players: {
          include: {
            player: true,
          },
        },
      },
    });
  }

  async getTeams() {
    return this.prisma.team.findMany({
      include: {
        players: {
          include: {
            player: true,
          },
        },
      },
    });
  }

  async getTeamById(id: number) {
    return this.prisma.team.findUnique({
      where: { id },
      include: {
        players: {
          include: {
            player: true,
          },
        },
      },
    });
  }

  async addPlayerToTeam(teamId: number, playerId: number) {
    return this.prisma.playerTeam.create({
      data: {
        teamId,
        playerId,
      },
    });
  }
}
