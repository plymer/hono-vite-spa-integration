import { Hono } from "hono";
import { serve } from "@hono/node-server";
// import { serveStatic } from "@hono/node-server/serve-static";
import "dotenv/config";

const app = new Hono({ strict: false });

const isProd = process.env.AM_I_A_SERVER;
const testEnv = process.env.TEST;

console.log(isProd, testEnv);

app.get("/", (c) => {
  return c.text("Hello, Hono!");
});

if (isProd) {
  serve(app, (info) => console.log(`Server running at http://${info.address}:${info.port}`));
}

export default app;

