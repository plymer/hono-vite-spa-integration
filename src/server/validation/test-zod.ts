import { z } from "zod";

export const testQuerySchema = z.strictObject({
  name: z.string({ error: "Need to specify a name of length 1" }).min(1),
});

export const testResponseSchema = z.strictObject({
  status: z.literal("success"),
  response: z.string(),
});

