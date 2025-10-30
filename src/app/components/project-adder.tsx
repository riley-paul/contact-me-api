import { Dialog, IconButton } from "@radix-ui/themes";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import ProjectForm from "./project-form";

const ProjectAdder: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <IconButton size="2" variant="ghost" radius="full">
          <PlusIcon className="size-4" />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Content className="grid gap-6">
        <header>
          <Dialog.Title size="4">Add New Project</Dialog.Title>
          <Dialog.Description size="2" color="gray">
            Fill out the form below to create a new project.
          </Dialog.Description>
        </header>
        <ProjectForm onSubmit={() => setOpen(false)} />
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ProjectAdder;
