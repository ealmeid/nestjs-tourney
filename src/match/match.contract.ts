import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

export const MatchContract = c.router({
  createMatch: {
    method: 'POST',
    path: '/matches',
    responses: {
      201: z.object({
        id: z.number(),
        stageId: z.number().nullable(),
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
          stageId: z.number().nullable(),
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
    body: z.object({}),
  },
  saveRound: {
    method: 'POST',
    path: '/matches/:matchId/rounds/:roundId',
    responses: {
      200: z.object({
        id: z.number(),
        scoreA: z.number(),
        scoreB: z.number(),
      }),
    },
    body: z.object({
      roundId: z.number(),
      teamAScore: z.number(),
      teamBScore: z.number(),
    }),
  },
});
