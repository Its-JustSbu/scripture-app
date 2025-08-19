import type { Route } from "./+types/home";
import Sidebar from "~/components/sidebar";
import { Outlet } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
   <div>Hello World</div>
  );
}
