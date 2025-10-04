import { defineConfig, type UserConfig } from "vite";
import devServer from "@hono/vite-dev-server";
import nodeAdapter from "@hono/vite-dev-server/node";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

const pathAliases: UserConfig["resolve"] = {
  alias: {
    "@": resolve(__dirname, "src/client"),
    "@shared": resolve(__dirname, "src/shared"),
    "@server": resolve(__dirname, "src/server"),
  },
};

const baseClientConfig: UserConfig = {
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: pathAliases,
};

export default defineConfig(({ command, mode }) => {
  if (command === "build") {
    switch (mode) {
      case "server":
        return {
          resolve: pathAliases,
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
      default: // Default to client build if no mode specified
        return {
          ...baseClientConfig,
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
  }

  // dev configuration
  return {
    ...baseClientConfig,
    plugins: [
      devServer({
        entry: "src/server/main.ts",
        adapter: nodeAdapter,
      }),
      ...baseClientConfig.plugins!,
    ],
  };
});

