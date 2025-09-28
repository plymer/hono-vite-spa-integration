import { getClientAssets } from "./manifest.js";

/**
 * Generates the HTML for the Single Page Application (SPA) to be served.
 * @param isProd - Indicates if the server is running in production mode
 * @returns HTML string for initializing the App's client page.
 */
export function serveSPA(appTitle: string, isProd: boolean): string {
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

  return `
<!DOCTYPE html>
<html lang="en-CA">
  <head>
   <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-title" content="${appTitle}" />
    <meta name="theme-color" content="#ffffff" />

    <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="shortcut icon" href="/favicon.ico" />

    <title>${appTitle}</title>
    ${cssFiles.map((cssFile) => `<link rel="stylesheet" href="${cssFile}" />`).join("\n    ")}
    ${reactRefreshPreamble}
    <script type="module" src="${clientBundle}"></script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
`;
}

