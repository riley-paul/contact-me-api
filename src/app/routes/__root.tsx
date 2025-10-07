import { IconButton, Separator } from "@radix-ui/themes";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { DraftingCompassIcon } from "lucide-react";
import NavBar from "../components/nav-bar";

const RootLayout = () => (
  <main className="flex min-h-screen overflow-hidden">
    <NavBar />
    <Separator orientation="vertical" size="4" />
    <div className="flex-1">
      <Outlet />
    </div>
    <TanStackRouterDevtools />
  </main>
);

export const Route = createRootRoute({ component: RootLayout });
