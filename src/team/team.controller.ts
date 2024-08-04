import { Controller } from '@nestjs/common';
import { TeamService } from './team.service';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { TeamContract } from './teamContract';

@Controller()
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @TsRestHandler(TeamContract)
  async handler() {
    return tsRestHandler(TeamContract, {
      createTeam: async ({ body: { name, playerIds } }) => {
        const team = await this.teamService.createTeam(name, playerIds);

        return {
          status: 201,
          body: team,
        };
      },

      getTeams: async () => {
        const teams = await this.teamService.getTeams();

        return {
          status: 200,
          body: teams,
        };
      },

      getTeamById: async ({ params: { id } }) => {
        const team = await this.teamService.getTeamById(Number(id));
        return {
          status: 200,
          body: team,
        };
      },

      addPlayerToTeam: async ({ params: { teamId, playerId } }) => {
        const playerTeam = await this.teamService.addPlayerToTeam(
          Number(teamId),
          Number(playerId),
        );
        return {
          status: 201,
          body: playerTeam,
        };
      },
    });
  }
}
