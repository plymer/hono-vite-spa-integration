import fs from "fs";
import path from "path";

let manifestCache: any = null;

export function getClientAssetPath(isProd: boolean): string {
  const entry = "src/client/main.tsx";

  // In development, return the dev server path
  if (!isProd) return entry;

  // in production, read the manifest to get the hashed filename
  if (!manifestCache) {
    try {
      const manifestPath = path.join(process.cwd(), "dist", ".vite", "manifest.json");
      const manifestContent = fs.readFileSync(manifestPath, "utf-8");
      manifestCache = JSON.parse(manifestContent);
    } catch (error) {
      console.error("Failed to read manifest.json:", error);
      return "/assets/main.js"; // fallback
    }
  }

  const asset = manifestCache[entry];
  if (!asset) {
    console.error(`Asset not found in manifest: ${entry}`);
    return "/assets/main.js"; // fallback
  }

  return `/${asset.file}`;
}

