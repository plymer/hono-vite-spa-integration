import { Hono } from "hono";
import { compress } from "hono/compress";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import "dotenv/config";
import { serveSPA } from "./lib/serveSpa";
import api from "./api";

const app = new Hono({ strict: false });

// make a boolean check for the presence of the server environment variable
const isProd = !!process.env.AM_I_A_SERVER;

// use gzip compression on this server
app.use("*", compress());

// serve the api routes
app.route("/api", api);

// when in production, we have to serve static files from the dist folder
if (isProd) app.use("/*", serveStatic({ root: "./dist" }));

// serve the spa client
app.get("/", (c) => {
  return c.html(serveSPA("Prairie Wx", isProd));
});

// in production, set up the node server to listen on the port specified
if (isProd) {
  serve({ fetch: app.fetch, port: 3000 }, (info) => console.log(`Server running at http://localhost:${info.port}`));
} else {
  console.log("\nServer running in development mode.");
}

// otherwise, in dev we just export the app for the dev server to use
export default app;

