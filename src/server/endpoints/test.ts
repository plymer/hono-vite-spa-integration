import { Hono } from "hono";

const route = new Hono();

route.get("/", (c) => {
  return c.json({ message: "Test endpoint is working!" });
});

export default route;
