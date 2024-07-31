import { Controller } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { TsRestHandler } from '@ts-rest/nest';

const c = initContract();

const TournamentContract = c.router({
  createTournament: {
    method: 'POST',
    path: '/tournaments',
    responses: {
      201: z.object({
        id: z.number(),
        name: z.string(),
        leagueId: z.number().nullable(),
      }),
    },
    body: z.object({
      name: z.string(),
      leagueId: z.number().optional(),
    }),
  },
  getTournaments: {
    method: 'GET',
    path: '/tournaments',
    responses: {
      200: z.array(
        z.object({
          id: z.number(),
          name: z.string(),
          league: z.object({
            id: z.number(),
            name: z.string(),
            description: z.string().optional(),
          }),
        }),
      ),
    },
  },
});

@Controller()
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @TsRestHandler(TournamentContract)
  async handler() {
    return {
      createTournament: async ({ body }) => {
        const tournament = await this.tournamentService.createTournament(
          body.name,
          body.leagueId,
        );
        return {
          status: 201,
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
    };
  }
}
