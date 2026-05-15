import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("ticker/:exchangeTicker", "routes/ticker.$exchangeTicker.tsx"),
  route("staticTicker", "routes/staticTicker.tsx"),
] satisfies RouteConfig;
