import { Controller } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { TournamentContract } from './tournament.contract';

@Controller()
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @TsRestHandler(TournamentContract)
  async handler() {
    return tsRestHandler(TournamentContract, {
      createTournament: async ({ body: { name, leagueId } }) => {
        const tournament = await this.tournamentService.createTournament(
          name,
          leagueId,
        );

        return {
          status: 201,
          body: tournament,
        };
      },
      addStage: async ({ params: { tournamentId }, body }) => {
        try {
          const stage = await this.tournamentService.addStage(
            parseInt(tournamentId),
            body.bracketType,
            body.name,
          );

          if (!stage) {
            return {
              status: 404,
              body: 'Stage not found',
            };
          }

          return {
            status: 201,
            body: stage,
          };
        } catch (error) {
          return {
            status: 500,
            body: error,
          };
        }
      },
      getTournament: async ({ params: { tournamentId } }) => {
        const tournament = await this.tournamentService.getTournament(
          parseInt(tournamentId),
        );

        if (!tournament) {
          return {
            status: 404,
            body: 'Tournament not found',
          };
        }

        return {
          status: 200,
          body: tournament,
        };
      },
      getTournaments: async () => {
        const tournaments = await this.tournamentService.getTournaments();

        return {
          status: 200,
          body: tournaments,
        };
      },
      startTournament: async ({ params: { tournamentId }, body: {} }) => {
        try {
          const tournament = await this.tournamentService.startTournament(
            parseInt(tournamentId),
          );

          if (!tournament) {
            return {
              status: 404,
              body: 'Tournament not found',
            };
          }

          return {
            status: 201,
            body: tournament,
          };
        } catch (error) {
          return {
            status: 500,
            body: 'An error occurred while starting the tournament',
          };
        }
      },
    });
  }
}
