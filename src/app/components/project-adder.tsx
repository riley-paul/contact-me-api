import React from "react";
import ProjectForm from "./project-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { atom, useAtom } from "jotai";
import { useNavigate } from "@tanstack/react-router";

export const projectAdderOpenAtom = atom(false);

const ProjectAdder: React.FC = () => {
  const [open, setOpen] = useAtom(projectAdderOpenAtom);
  const navigate = useNavigate();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new project.
          </DialogDescription>
        </DialogHeader>
        <ProjectForm
          onSuccess={(project) => {
            navigate({
              to: "/projects/$projectId",
              params: { projectId: project.id },
            });
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProjectAdder;
