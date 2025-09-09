import { Dialog } from "@radix-ui/themes";
import React from "react";
import ProjectForm from "./project-form";
import { useAtom } from "jotai/react";
import { projectEditorAtom } from "./project-editor.store";

const ProjectEditor: React.FC = () => {
  const [state, dispatch] = useAtom(projectEditorAtom);
  return (
    <Dialog.Root
      open={state.isOpen}
      onOpenChange={() => dispatch({ type: "close" })}
    >
      <Dialog.Content>
        <header>
          <Dialog.Title>
            {state.project ? "Edit Project" : "New Project"}
          </Dialog.Title>
          <Dialog.Description>
            {state.project
              ? "Edit the details of your project."
              : "Fill out the form below to create a new project."}
          </Dialog.Description>
        </header>
        <ProjectForm project={state.project} />
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ProjectEditor;
