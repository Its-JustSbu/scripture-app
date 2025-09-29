import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("", "routes/layout.tsx", [
    route("profile", "./routes/profile.tsx"),
    route("scriptures/:id", "./routes/scripture-chat.tsx"),
    route("", "./routes/scriptures.tsx"),
    route("*", "./routes/notFound.tsx"),
  ]),
] satisfies RouteConfig;
