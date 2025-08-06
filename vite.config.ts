import { defineConfig } from "vite";
import devServer from "@hono/vite-dev-server";
import nodeAdapter from "@hono/vite-dev-server/node";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
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
      default: // Default to client build if no mode specified
        return {
          base: "./",
          plugins: [react(), tailwindcss()],
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
    base: "./",
    plugins: [
      devServer({
        entry: "src/server/main.ts",
        adapter: nodeAdapter,
      }),
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src/client"),
        "@shared": path.resolve(__dirname, "src/shared"),
      },
    },
  };
});

