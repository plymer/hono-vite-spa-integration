import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import "dotenv/config";
import { getClientAssetPath } from "./manifest.js";

const app = new Hono({ strict: false });

// make a boolean check for the presence of the server environment variable
const isProd = !!process.env.AM_I_A_SERVER;

app.get("/", (c) => {
  const clientScriptPath = getClientAssetPath(isProd);

  return c.html(`
<!DOCTYPE html>
<html lang="en-CA">
  <head>
   <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-title" content="PrairieWx Beta" />
    <meta name="theme-color" content="#ffffff" />

    <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="shortcut icon" href="/favicon.ico" />

    <title>Prairie Wx</title>
    <script type="module" src="${clientScriptPath}"></script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
`);
});

console.log("hi there");

// when in production, we have to serve static files from the dist folder
if (isProd) app.use("/*", serveStatic({ root: "./dist" }));

if (isProd) {
  serve(app, (info) => console.log(`Server running at http://localhost:${info.port}`));
} else {
  console.log("\nServer running in development mode.");
}

export default app;

