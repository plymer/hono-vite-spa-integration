import fs from "fs";
import path from "path";

let manifestCache: any = null;

export function getClientAssets(isProd: boolean): { js: string; css: string[] } {
  const entry = "src/client/main.tsx";

  // In development, return the dev server path
  if (!isProd) {
    return {
      js: entry,
      css: [], // No CSS files in dev mode (Tailwind is processed on-demand)
    };
  }

  // in production, read the manifest to get the hashed filename
  if (!manifestCache) {
    try {
      const manifestPath = path.join(process.cwd(), "dist", ".vite", "manifest.json");
      const manifestContent = fs.readFileSync(manifestPath, "utf-8");
      manifestCache = JSON.parse(manifestContent);
    } catch (error) {
      console.error("Failed to read manifest.json:", error);
      return {
        js: "/assets/main.js",
        css: [],
      };
    }
  }

  const asset = manifestCache[entry];
  if (!asset) {
    console.error(`Asset not found in manifest: ${entry}`);
    return {
      js: "/assets/main.js",
      css: [],
    };
  }

  return {
    js: `/${asset.file}`,
    css: asset.css ? asset.css.map((file: string) => `/${file}`) : [],
  };
}

// Keep the old function for backwards compatibility
export function getClientAssetPath(isProd: boolean): string {
  return getClientAssets(isProd).js;
}

