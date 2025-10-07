import { Edit2Icon, PlusIcon } from "lucide-react";
import React from "react";
import ProjectForm from "./project-form";
import RadixProvider from "./radix-provider";
import type { ProjectSelect } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  project?: ProjectSelect;
};

const ProjectEditor: React.FC<Props> = ({ project }) => {
  return (
    <RadixProvider asChild>
      <Dialog>
        <DialogTrigger>
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
        </DialogTrigger>
        <DialogContent className="grid gap-6">
          <header>
            <DialogTitle>{project ? "Edit" : "New"} Project</DialogTitle>
            <DialogDescription>
              Make changes to your project here. Click save when you're done.
            </DialogDescription>
          </header>
          <ProjectForm project={project} />
        </DialogContent>
      </Dialog>
    </RadixProvider>
  );
};

export default ProjectEditor;
