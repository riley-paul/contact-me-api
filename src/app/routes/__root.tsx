import { Outlet, createRootRoute } from "@tanstack/react-router";
import DeleteConfirm from "@/app/components/delete-confirm";
import { actions } from "astro:actions";
import AppSidebar from "@/app/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import ContextBreadcrumbs from "../components/context-breadcrumbs";

export const Route = createRootRoute({
  component: RootComponent,
  loader: async () => {
    const user = await actions.users.getOne.orThrow();
    const projects = await actions.projects.getAll.orThrow({});
    return { user, projects, crumb: "" };
  },
});

function RootComponent() {
  const { user, projects } = Route.useLoaderData();
  return (
    <SidebarProvider>
      <AppSidebar projects={projects} user={user} />
      <main className="flex h-screen flex-1 flex-col overflow-hidden">
        <header className="flex h-12 items-center gap-5 border-b px-2">
          <SidebarTrigger />
          <ContextBreadcrumbs />
        </header>
        <Outlet />
      </main>
      <DeleteConfirm />
    </SidebarProvider>
  );
}
