import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const sampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
      await sleep(2000);
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
});
