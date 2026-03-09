import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React from "react";
import CustomCard from "../components/ui/custom-card";
import { Settings2Icon, Trash2Icon } from "lucide-react";
import ProjectForm from "../components/project-form";
import { actions } from "astro:actions";
import { Button } from "../components/ui/button";
import { useSetAtom } from "jotai";
import { deleteConfirmAtom } from "../components/delete-confirm";
import { toast } from "sonner";

export const Route = createFileRoute("/projects/$projectId/settings")({
  component: RouteComponent,
  loader: async ({ params: { projectId } }) => {
    const project = await actions.projects.getOne.orThrow({ projectId });
    return { project, crumb: "Settings" };
  },
});

function RouteComponent() {
  const { project } = Route.useLoaderData();
  const navigate = useNavigate();
  const setDeleteConfirm = useSetAtom(deleteConfirmAtom);

  const handleDelete = () => {
    setDeleteConfirm({
      open: true,
      onConfirm: async () => {
        await actions.projects.remove.orThrow({ projectId: project.id });
        toast.success("Project deleted successfully");
        navigate({ to: "/" });
      },
    });
  };

  return (
    <React.Fragment>
      <CustomCard
        title="Configuration"
        subtitle="Update your project name and notification settings"
        icon={Settings2Icon}
      >
        <ProjectForm key={project.updatedAt} project={project} />
      </CustomCard>

      <CustomCard
        title="Danger Zone"
        subtitle="Permanently delete this project and all its messages"
        icon={Trash2Icon}
      >
        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground text-sm">
            Once you delete a project, there is no going back. Please be
            certain.
          </p>
          <div>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2Icon className="size-4" />
              Delete Project
            </Button>
          </div>
        </div>
      </CustomCard>
    </React.Fragment>
  );
}
