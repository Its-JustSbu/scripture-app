import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("./routes/home.tsx"),  
  route("main", "routes/layout.tsx", [
    route("profile", "./routes/profile.tsx"),
    route("scriptures/:id", "./routes/scripture-chat.tsx"),
    route("scriptures", "./routes/scriptures.tsx"),
  ]),
] satisfies RouteConfig;
