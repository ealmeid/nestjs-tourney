import { Controller } from '@nestjs/common';
import { MatchService } from './match.service';
import { TsRestHandler } from '@ts-rest/nest';
import { MatchContract } from './match.contract';

@Controller()
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @TsRestHandler(MatchContract)
  async handler() {
    return {
      createMatch: async ({ body }) => {
        const match = await this.matchService.createMatch(
          body.teamAId,
          body.teamBId,
          body.stageId,
        );

        return {
          status: 201,
          body: match,
        };
      },
      getMatches: async ({ query }) => {
        const matches = await this.matchService.getMatches(query.tournamentId);

        return {
          status: 200,
          body: matches,
        };
      },
      addRound: async ({ params: { matchId } }) => {
        const updatedMatch = await this.matchService.addRound(matchId);

        return {
          status: 200,
          body: updatedMatch,
        };
      },
    };
  }
}
