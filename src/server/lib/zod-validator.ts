import { ZodType } from "zod";
import type { ValidationTargets } from "hono";
import { zValidator as zv } from "@hono/zod-validator";

/**
 * Hono Middleware to validate request parameters using Zod schemas.
 * @param target The part of the request to validate (e.g., "query", "body", "params")
 * @param schema The Zod schema to validate against
 * @returns A Hono middleware that validates the specified part of the request
 *
 * This middleware uses the zod-validator from Hono to validate request parameters.
 * If validation fails, it responds with a 400 status and details about the validation errors.
 * If validation succeeds, it allows the request to proceed to the next handler.
 *
 * Example usage:
 * ```typescript
 * const querySchema = z.object({
 * name: z.string().min(1),
 *   age: z.number().min(0),
 * });
 *
 * app.get("/endpoint", validateParams("query", querySchema), (c) => {
 *   const { name, age } = c.req.valid("query");
 *   return c.json({ message: `Hello ${name}, you are ${age} years old.` });
 * });
 * ```
 */
export const validateParams = <T extends ZodType, Target extends keyof ValidationTargets>(target: Target, schema: T) =>
  zv(target, schema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          status: "error",
          message: "invalid input",
          error: result.error.issues.map((i) => i),
        },
        400
      );
    }
  });

