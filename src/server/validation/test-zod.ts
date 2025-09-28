import { z } from "zod";

export const testSchema = z.strictObject({
  name: z.string({ error: "Need to specify a name of length 1" }).min(1),
});

