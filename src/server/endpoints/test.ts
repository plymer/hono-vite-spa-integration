import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { testSchema } from "@server/validation/test-zod";

const route = new Hono();

route.get("/", zValidator("query", testSchema), (c) => {
  console.log("query validation", c.req.valid("query"));
  try {
    const { name } = c.req.valid("query");
    if (!name) {
      return c.json({ message: "Hello there. The test endpoint is working!" }, 200);
    } else {
      return c.json({ message: `Hello ${name}, the test endpoint is working!` }, 200);
    }
  } catch (error) {
    return c.json({ error: "An unexpected error occurred." }, 500);
  }
});

route.get("/error", (c) => {
  return c.json({ error: "This is a test error message." }, 500);
});

export default route;

