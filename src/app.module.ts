import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { LeagueModule } from './league/league.module';
import { MatchController } from './match/match.controller';
import { MatchService } from './match/match.service';
import { PlayerService } from './player/player.service';
import { PlayerController } from './player/player.controller';
import { TeamService } from './team/team.service';
import { TeamController } from './team/team.controller';
import { TournamentController } from './tournament/tournament.controller';
import { TournamentService } from './tournament/tournament.service';

@Module({
  imports: [PrismaModule, LeagueModule],
  providers: [
    TournamentService,
    PrismaService,
    MatchService,
    PlayerService,
    TeamService,
  ],
  controllers: [
    TournamentController,
    MatchController,
    PlayerController,
    TeamController,
  ],
})
export class AppModule {}
