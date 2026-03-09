import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/messages")({
  component: RouteComponent,
  loader: () => ({ crumb: "Messages" }),
});

function RouteComponent() {
  return (
    <article className="overflow-auto px-6 py-4">
      <Outlet />
    </article>
  );
}
