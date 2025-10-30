import { Edit2Icon, PlusIcon } from "lucide-react";
import React from "react";
import ProjectForm from "./project-form";
import type { ProjectSelect } from "@/lib/types";
import { Button, Dialog } from "@radix-ui/themes";


type Props = {
  project?: ProjectSelect;
};

const ProjectEditor: React.FC<Props> = ({ project }) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>
          {project ? (
            <React.Fragment>
              <Edit2Icon className="size-4" />
              Edit Project
            </React.Fragment>
          ) : (
            <React.Fragment>
              <PlusIcon className="size-4" />
              New Project
            </React.Fragment>
          )}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content className="w-full max-w-4xl">
        <header>
          <Dialog.Title>{project ? "Edit" : "New"} Project</Dialog.Title>
          <Dialog.Description>
            {project
              ? "Make changes to your project here"
              : "Create a new project here"}
          </Dialog.Description>
        </header>
        <ProjectForm project={project} />
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ProjectEditor;
