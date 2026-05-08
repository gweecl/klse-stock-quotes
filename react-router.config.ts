import type { Config } from "@react-router/dev/config";

const ghPagesBase = "/klse-stock-quotes";
const isGitHubPagesBuild = process.env.GH_PAGES === "true";

export default {
  // Only set basename for GitHub Pages builds.
  basename: isGitHubPagesBuild ? ghPagesBase : "/",
  ssr: false,
  // prerender: ["/"],
} satisfies Config;
