import { defineConfig } from "vite";
import devServer from "@hono/vite-dev-server";
import nodeAdapter from "@hono/vite-dev-server/node";

export default defineConfig(({ command, mode }) => {
  if (command === "build" && mode === "server") {
    // Server build configuration
    return {
      build: {
        outDir: "dist",
        emptyOutDir: false, // Don't clear the dist folder
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
  }

  if (command === "build" && (mode === "client" || mode === "production")) {
    // Client build configuration (regular build)
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

  // Development configuration
  return {
    base: "./",
    plugins: [
      devServer({
        entry: "src/server/main.ts",
        adapter: nodeAdapter,
      }),
    ],
  };
});

