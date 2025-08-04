import { defineConfig } from "vite";
import devServer from "@hono/vite-dev-server";
import nodeAdapter from "@hono/vite-dev-server/node";
import path from "path";

export default defineConfig(({ command, mode }) => {
  if (command === "build") {
    switch (mode) {
      case "server":
        return {
          build: {
            outDir: "dist",
            emptyOutDir: false, // don't clear the dist folder, since we have already built the client
            lib: {
              entry: "src/server/main.ts",
              name: "server",
              formats: ["es"],
            },
            rollupOptions: {
              external: ["@hono/node-server", "hono", "dotenv"],
              output: {
                entryFileNames: "server/main.js",
              },
            },
            ssr: true,
          },
        };
      case "client":
        return {
          base: "/",
          build: {
            outDir: "dist",
            rollupOptions: {
              input: "src/client/main.tsx",
              output: {
                entryFileNames: "assets/[name]-[hash].js",
                chunkFileNames: "assets/[name]-[hash].js",
                assetFileNames: "assets/[name]-[hash].[ext]",
              },
            },
            manifest: true,
          },
        };
    }
  } else {
    // dev configuration
    return {
      base: "./",
      plugins: [
        devServer({
          entry: "src/server/main.ts",
          adapter: nodeAdapter,
          handleHotUpdate: ({ server }) => {
            // for now, we just do a full reload on any file change
            // we may want to change this later to only reload on specific file/filetype changes
            server.hot.send({ type: "full-reload" });

            // https://github.com/honojs/vite-plugins/tree/main/packages/dev-server#options
            // const isSSR = modules.some((mod) => mod._ssrModule);
            // if (isSSR) {
            //   server.hot.send({ type: "full-reload" });
            //   return [];
            // }
            // if (file.endsWith(".ts") || file.endsWith(".tsx")) {
            //   server.ws.send({
            //     type: "full-reload",
            //   });
            // }
          },
        }),
      ],
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "src/client"),
          "@shared": path.resolve(__dirname, "src/shared"),
        },
      },
    };
  }
});

