import { defineConfig } from "vite";
import devServer from "@hono/vite-dev-server";
import nodeAdapter from "@hono/vite-dev-server/node";

export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
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
    target: "node18",
  },
  plugins: [
    devServer({
      entry: "src/server/main.ts",
      adapter: nodeAdapter,
    }),
  ],
});

