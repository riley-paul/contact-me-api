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
        <Dialog.Content>
          <header>
            <Dialog.Title>Edit Project</Dialog.Title>
            <Dialog.Description>
              Make changes to your project here. Click save when you're done.
            </Dialog.Description>
          </header>
          <ProjectForm />
        </Dialog.Content>
      </Dialog.Root>
    </RadixProvider>
  );
};

export default ProjectEditor;
