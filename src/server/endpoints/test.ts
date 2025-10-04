import { Hono } from "hono";
import { safeParse } from "zod";
import { ContentfulStatusCode } from "hono/utils/http-status";

import { testResponseSchema, testQuerySchema } from "@server/validation/test-zod";
import { validateParams } from "@server/lib/zod-validator";

const route = new Hono();

route.get("/", validateParams("query", testQuerySchema), (c) => {
  const { name, age, active } = c.req.valid("query");

  const errorCode: ContentfulStatusCode[] = [];

  try {
    const res = safeParse(testResponseSchema, {
      status: "success",
      response: `Hello ${name}, the test endpoint is working! You are ${age} and ${active ? "active" : "not active"}.`,
    });

    if (!res.success) {
      errorCode.push(403);
      throw new Error("Response validation failed");
    }

    return c.json(res.data, 200);
  } catch (error) {
    return c.json({ status: "error", message: (error as Error).message }, errorCode[0]);
  }
});

route.get("/error", (c) => {
  return c.json({ error: "This is a test error message." }, 500);
});

export default route;

