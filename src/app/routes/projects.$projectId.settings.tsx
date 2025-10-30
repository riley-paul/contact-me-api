import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import CustomCard from "../components/ui/custom-card";
import { Settings2Icon } from "lucide-react";
import ProjectForm from "../components/project-form";
import { actions } from "astro:actions";

export const Route = createFileRoute("/projects/$projectId/settings")({
  component: RouteComponent,
  loader: async ({ params: { projectId } }) => {
    const project = await actions.projects.getOne.orThrow({ projectId });
    return { project };
  },
});

function RouteComponent() {
  const { project } = Route.useLoaderData();
  return (
    <React.Fragment>
      <CustomCard
        title="Configuration"
        subtitle="Update your project name and notification settings"
        icon={Settings2Icon}
      >
        <ProjectForm project={project} />
      </CustomCard>
    </React.Fragment>
  );
}
