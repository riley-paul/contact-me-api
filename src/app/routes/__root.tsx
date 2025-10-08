import { Separator } from "@radix-ui/themes";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import NavBar from "../components/nav-bar";
import type { QueryClient } from "@tanstack/react-query";

const RootLayout = () => (
  <main className="flex h-screen overflow-hidden">
    <NavBar />
    <Separator orientation="vertical" size="4" />
    <div className="flex-1">
      <Outlet />
    </div>
    <TanStackRouterDevtools position="bottom-right" />
  </main>
);

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootLayout,
});
