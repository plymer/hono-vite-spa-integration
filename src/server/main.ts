import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import "dotenv/config";
import { serveSPA } from "./lib/spa.js";

const app = new Hono({ strict: false });

// make a boolean check for the presence of the server environment variable
const isProd = !!process.env.AM_I_A_SERVER;

// serve the spa client
app.get("/", (c) => {
  return c.html(serveSPA("Prairie Wx", isProd));
});

// when in production, we have to serve static files from the dist folder
if (isProd) app.use("/*", serveStatic({ root: "./dist" }));

// in production, set up the node server to listen on the port specified
if (isProd) {
  serve({ fetch: app.fetch, port: 3000 }, (info) => console.log(`Server running at http://localhost:${info.port}`));
} else {
  console.log("\nServer running in development mode.");
}

// otherwise, in dev we just export the app for the dev server to use
export default app;

