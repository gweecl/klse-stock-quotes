import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const ghPagesBase = "/klse-stock-quotes/";
const isGitHubPagesBuild = process.env.GH_PAGES === "true";

export default defineConfig({
  base: isGitHubPagesBuild ? ghPagesBase : "/",
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
});
