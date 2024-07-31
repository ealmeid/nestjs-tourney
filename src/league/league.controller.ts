import { Controller } from '@nestjs/common';
import { LeagueService } from './league.service';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { TsRestHandler } from '@ts-rest/nest';

const c = initContract();

const LeagueContract = c.router({
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
