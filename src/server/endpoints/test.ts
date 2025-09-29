import { Hono } from "hono";
import { safeParse } from "zod";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { zValidator } from "@hono/zod-validator";

import { testResponseSchema, testQuerySchema } from "@server/validation/test-zod";

const route = new Hono();

route.get("/", zValidator("query", testQuerySchema), (c) => {
  const { name } = c.req.valid("query");

  const errorCode: ContentfulStatusCode[] = [];

  try {
    const res = safeParse(testResponseSchema, {
      status: "success",
      response: `Hello ${name}, the test endpoint is working!`,
    });

    if (!res.success) {
      errorCode.push(403);
      throw new Error("Response validation failed");
    }

    return c.json(res.data, 200);
  } catch (error) {
    return c.json(null, errorCode[0]);
  }
});

route.get("/error", (c) => {
  return c.json({ error: "This is a test error message." }, 500);
});

export default route;

