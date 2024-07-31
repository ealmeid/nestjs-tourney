import { Controller } from '@nestjs/common';
import { MatchService } from './match.service';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { TsRestHandler } from '@ts-rest/nest';

const c = initContract();

const MatchContract = c.router({
  createMatch: {
    method: 'POST',
    path: '/matches',
    responses: {
      201: z.object({
        id: z.number(),
        tournamentId: z.number().nullable(),
        teamAId: z.number(),
        teamBId: z.number(),
        scoreA: z.number(),
        scoreB: z.number(),
      }),
    },
    body: z.object({
      teamAId: z.number(),
      teamBId: z.number(),
      tournamentId: z.number().optional(),
    }),
  },
  getMatches: {
    method: 'GET',
    path: '/matches',
    responses: {
      200: z.array(
        z.object({
          id: z.number(),
          tournamentId: z.number().nullable(),
          teamA: z.object({ id: z.number(), name: z.string() }),
          teamB: z.object({ id: z.number(), name: z.string() }),
          scoreA: z.number(),
          scoreB: z.number(),
          rounds: z.array(
            z.object({
              roundNumber: z.number(),
              teamAScore: z.number(),
              teamBScore: z.number(),
            }),
          ),
        }),
      ),
    },
    query: z.object({
      tournamentId: z.number().optional(),
    }),
  },
  addRound: {
    method: 'POST',
    path: '/matches/:matchId/rounds',
    responses: {
      200: z.object({
        id: z.number(),
        scoreA: z.number(),
        scoreB: z.number(),
        winnerId: z.number().nullable(),
      }),
    },
    body: z.object({
      roundNumber: z.number(),
      teamAScore: z.number(),
      teamBScore: z.number(),
    }),
  },
});

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
          body.tournamentId,
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
      addRound: async ({ params: { matchId }, body }) => {
        const updatedMatch = await this.matchService.addRound(
          matchId,
          body.roundNumber,
          body.teamAScore,
          body.teamBScore,
        );
        return {
          status: 200,
          body: updatedMatch,
        };
      },
    };
  }
}
