import { Controller } from '@nestjs/common';
import { TsRestHandler } from '@ts-rest/nest';

import { LeagueService } from './league.service';
import { LeagueContract } from './league.contract';

@Controller()
export class LeagueController {
  constructor(private readonly leagueService: LeagueService) {}

  @TsRestHandler(LeagueContract)
  async handler() {
    return {
      createLeague: async ({ body }) => {
        const league = await this.leagueService.createLeague(
          body.name,
          body.description,
        );

        return {
          status: 201,
          body: league,
        };
      },
      getLeagues: async () => {
        const leagues = await this.leagueService.getLeagues();

        return {
          status: 200,
          body: leagues,
        };
      },
    };
  }
}
