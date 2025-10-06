import { Button, Dialog } from "@radix-ui/themes";
import { Edit2Icon, PlusIcon } from "lucide-react";
import React from "react";
import ProjectForm from "./project-form";
import RadixProvider from "./radix-provider";
import type { ProjectSelect } from "@/lib/types";

type Props = {
  project?: ProjectSelect;
};

const ProjectEditor: React.FC<Props> = ({ project }) => {
  return (
    <RadixProvider asChild>
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
        <Dialog.Content className="grid gap-6">
          <header>
            <Dialog.Title trim="both">
              {project ? "Edit" : "New"} Project
            </Dialog.Title>
            <Dialog.Description color="gray" size="2">
              Make changes to your project here. Click save when you're done.
            </Dialog.Description>
          </header>
          <ProjectForm project={project} />
        </Dialog.Content>
      </Dialog.Root>
    </RadixProvider>
  );
};

export default ProjectEditor;
