import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

export const TeamContract = c.router({
  createTeam: {
    method: 'POST',
    path: '/teams',
    responses: {
      201: z.object({
        id: z.number(),
        name: z.string(),
        players: z.array(
          z.object({
            player: z.object({
              id: z.number(),
              name: z.string(),
              email: z.string(),
            }),
          }),
        ),
      }),
    },
    body: z.object({
      name: z.string(),
      playerIds: z.array(z.number()),
    }),
  },
  getTeams: {
    method: 'GET',
    path: '/teams',
    responses: {
      200: z.array(
        z.object({
          id: z.number(),
          name: z.string(),
          players: z.array(
            z.object({
              player: z.object({
                id: z.number(),
                name: z.string(),
                email: z.string(),
              }),
            }),
          ),
        }),
      ),
    },
  },
  getTeamById: {
    method: 'GET',
    path: '/teams/:id',
    responses: {
      200: z.object({
        id: z.number(),
        name: z.string(),
        players: z.array(
          z.object({
            player: z.object({
              id: z.number(),
              name: z.string(),
              email: z.string(),
            }),
          }),
        ),
      }),
    },
  },
  addPlayerToTeam: {
    method: 'POST',
    path: '/teams/:teamId/players/:playerId',
    responses: {
      201: z.object({
        id: z.number(),
        playerId: z.number(),
        teamId: z.number(),
      }),
    },
    body: z.object({}), // Add this line
  },
});
