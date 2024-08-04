import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

export const LeagueContract = c.router({
  createLeague: {
    method: 'POST',
    path: '/leagues',
    responses: {
      201: z.object({
        id: z.number(),
        name: z.string(),
        description: z.string().optional(),
      }),
    },
    body: z.object({
      name: z.string(),
      description: z.string().optional(),
    }),
  },
  getLeagues: {
    method: 'GET',
    path: '/leagues',
    responses: {
      200: z.array(
        z.object({
          id: z.number(),
          name: z.string(),
          description: z.string().optional(),
          tournaments: z.array(
            z.object({
              id: z.number(),
              name: z.string(),
            }),
          ),
        }),
      ),
    },
  },
});
