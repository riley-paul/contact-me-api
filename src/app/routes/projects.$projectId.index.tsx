import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/$projectId/")({
  component: RouteComponent,
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/projects/$projectId/messages", params });
  },
});

function RouteComponent() {
  return <div>Hello "/projects/$projectId/"!</div>;
}
