import { Dialog } from "@radix-ui/themes";
import React from "react";
import ProjectForm from "./project-form";
import { useAtom } from "jotai/react";
import { projectEditorAtom } from "./project-editor.store";
import AlertSystemTitleMessage from "../alert-system/alert-system-title-message";

const ProjectEditor: React.FC = () => {
  const [state, dispatch] = useAtom(projectEditorAtom);
  return (
    <Dialog.Root
      open={state.isOpen}
      onOpenChange={() => dispatch({ type: "close" })}
    >
      <Dialog.Content className="grid gap-8">
        <header>
          <AlertSystemTitleMessage
            title={state.project ? "Edit Project" : "New Project"}
            message={
              state.project
                ? "Edit the details of your project."
                : "Fill out the form below to create a new project."
            }
          />
        </header>
        <ProjectForm
          project={state.project}
          onSuccess={() => dispatch({ type: "close" })}
        />
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ProjectEditor;
