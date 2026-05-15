import type { Config } from "@react-router/dev/config";
import fs from "node:fs/promises";
import path from "node:path";
import { getKlseTickerPrerenderRoutes } from "./app/lib/prerender-tickers";

const ghPagesBase = "/klse-stock-quotes";
const isGitHubPagesBuild = process.env.GH_PAGES === "true";

export default {
  // Only set basename for GitHub Pages builds.
  basename: isGitHubPagesBuild ? ghPagesBase : "/",
  // disable lazy route discovery, loads the entire route manifest up front
  routeDiscovery: { mode: "initial" },
  // return a list of URLs to prerender at build time
  async prerender() {
    const tickerRoutes = await getKlseTickerPrerenderRoutes();
    return ["/", "/staticTicker", ...tickerRoutes];
  },
  /**
   * Flatten GitHub Pages build output
   *
   * When building for GitHub Pages with basename enabled:
   * - React Router uses basename to control app routing on the GitHub Pages subpath
   * - But this also causes prerendered HTML to be nested under /{basename}/ directory
   *
   * GitHub Pages expects the deployable files at build/client root level, so this hook
   * moves everything from build/client/{basename}/* back to build/client/* after build.
   *
   * This allows us to have both:
   * - Correct runtime routing (basename properly set for /{basename} subpath)
   * - Correct deployment structure (index.html at root, not nested)
   */
  async buildEnd({ reactRouterConfig }) {
    if (!isGitHubPagesBuild) {
      return;
    }

    const basename = reactRouterConfig.basename;
    const normalizedBasename = basename?.replace(/^\/+|\/+$/g, "");

    if (!normalizedBasename) {
      return;
    }

    const clientDir = path.resolve("build", "client");
    const nestedDir = path.join(clientDir, normalizedBasename);

    try {
      const entries = await fs.readdir(nestedDir, { withFileTypes: true });

      for (const entry of entries) {
        const source = path.join(nestedDir, entry.name);
        const destination = path.join(clientDir, entry.name);

        await fs.rm(destination, { recursive: true, force: true });
        await fs.rename(source, destination);
      }

      await fs.rm(nestedDir, { recursive: true, force: true });
      console.log("[react-router.config] Flattened GH Pages output.");
    } catch {
      // No nested directory means there is nothing to flatten.
    }
  },
} satisfies Config;
