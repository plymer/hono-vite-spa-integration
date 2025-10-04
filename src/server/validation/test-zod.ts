import { z } from "zod";

export const testQuerySchema = z.strictObject({
  name: z.string({ error: "Need to specify a name of length 1" }).min(1),
  age: z.coerce.number({ error: "Age must be a number" }),
  active: z.enum(["true", "false"]).transform((val) => val === "true"),
});

export const testResponseSchema = z.strictObject({
  status: z.literal("success"),
  response: z.string(),
});

