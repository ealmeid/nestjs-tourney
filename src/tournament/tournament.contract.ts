import { BracketType, TournamentStatus } from '@prisma/client';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

export const TournamentContract = c.router({
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
  getTournament: {
    method: 'GET',
    path: '/tournaments/:tournamentId',
    responses: {
      200: z.object({
        id: z.number(),
        name: z.string(),
        league: z.object({
          id: z.number(),
          name: z.string(),
          description: z.string().optional(),
        }),
      }),
    },
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
  addStage: {
    method: 'POST',
    path: '/tournaments/:tournamentId/stages',
    responses: {
      201: z.object({
        id: z.number(),
        name: z.string(),
        stageId: z.number(),
      }),
    },
    body: z.object({
      name: z.string(),
      bracketType: z.enum([
        BracketType.SWISS,
        BracketType.ROUND_ROBIN,
        BracketType.SINGLE_ELIMINATION,
        BracketType.DOUBLE_ELIMINATION,
      ]),
    }),
  },
  startTournament: {
    method: 'POST',
    path: '/tournaments/:tournamentId/start',
    body: z.object({}),
    responses: {
      201: z.object({
        id: z.number(),
        status: z.enum([
          TournamentStatus.TBD,
          TournamentStatus.SCHEDULED,
          TournamentStatus.IN_PROGRESS,
          TournamentStatus.COMPLETED,
        ]),
        name: z.string(),
        leagueId: z.number().nullable(),
      }),
      404: z.string(),
      500: z.string(),
    },
  },
});
