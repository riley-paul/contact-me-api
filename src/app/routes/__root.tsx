import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import AppSidebar from "../components/sidebar/sidebar";
import type { QueryClient } from "@tanstack/react-query";
import { qCurrentUser } from "@/lib/client/queries";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: RootComponent,
    loader: async ({ context }) =>
      Promise.all([context.queryClient.ensureQueryData(qCurrentUser)]),
  },
);

function RootComponent() {
  return (
    <main className="flex">
      <AppSidebar />
      <Outlet />
    </main>
  );
}
