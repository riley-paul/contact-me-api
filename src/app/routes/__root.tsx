import { Outlet, createRootRoute } from "@tanstack/react-router";
import DeleteConfirm from "@/app/components/delete-confirm";
import { actions } from "astro:actions";
import AppSidebar from "@/app/components/sidebar/app-sidebar";
import { SidebarProvider } from "../components/ui/sidebar";

export const Route = createRootRoute({
  component: RootComponent,
  loader: async () => {
    const user = await actions.users.getOne.orThrow();
    const projects = await actions.projects.getAll.orThrow({});
    return { user, projects };
  },
});

function RootComponent() {
  const { user, projects } = Route.useLoaderData();
  return (
    <SidebarProvider>
      <AppSidebar projects={projects} user={user} />
      <main className="container2 max-w-none flex-1">
        <article className="grid gap-6 py-6">
          <Outlet />
        </article>
        <DeleteConfirm />
      </main>
    </SidebarProvider>
  );
}
