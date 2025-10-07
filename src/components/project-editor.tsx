import { Edit2Icon, PlusIcon } from "lucide-react";
import React from "react";
import ProjectForm from "./project-form";
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
      <DialogContent className="w-full max-w-4xl">
        <DialogHeader>
          <DialogTitle>{project ? "Edit" : "New"} Project</DialogTitle>
          <DialogDescription>
            {project
              ? "Make changes to your project here"
              : "Create a new project here"}
          </DialogDescription>
        </DialogHeader>
        <ProjectForm project={project} />
      </DialogContent>
    </Dialog>
  );
};

export default ProjectEditor;
