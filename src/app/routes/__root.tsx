import {
  Outlet,
  createRootRoute,
  linkOptions,
  type LinkOptions,
} from "@tanstack/react-router";
import DeleteConfirm from "@/components/delete-confirm";
import { actions } from "astro:actions";
import Sidebar from "@/components/sidebar";

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
    <div className="flex">
      <Sidebar projects={projects} user={user} />
      <main className="container2 max-w-none flex-1">
        <article className="grid gap-8 py-6">
          <Outlet />
        </article>
        <DeleteConfirm />
      </main>
    </div>
  );
}
