import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import "dotenv/config";
import { getClientAssets } from "./manifest.js";

const app = new Hono({ strict: false });

// make a boolean check for the presence of the server environment variable
const isProd = !!process.env.AM_I_A_SERVER;

// serve the spa client
app.get("/", (c) => {
  const { js: clientBundle, css: cssFiles } = getClientAssets(isProd);

  // React Fast Refresh preamble for development
  const reactRefreshPreamble = !isProd
    ? `
    <script type="module">
      import RefreshRuntime from "/@react-refresh"
      RefreshRuntime.injectIntoGlobalHook(window)
      window.$RefreshReg$ = () => {}
      window.$RefreshSig$ = () => (type) => type
      window.__vite_plugin_react_preamble_installed__ = true
    </script>
    <script type="module" src="/@vite/client"></script>
  `
    : "";

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
    ${cssFiles.map((cssFile) => `<link rel="stylesheet" href="${cssFile}" />`).join("\n    ")}
    ${reactRefreshPreamble}
    <script type="module" src="${clientBundle}"></script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
`);
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

