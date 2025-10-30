import type { ProjectSelect } from "@/lib/types";
import React from "react";
import { SaveIcon } from "lucide-react";
import { Button, Separator, Text, TextField } from "@radix-ui/themes";

type Props = {
  project?: ProjectSelect;
};

const ProjectForm: React.FC<Props> = ({ project }) => {
  return (
    <form className="grid gap-6">
      <div className="grid gap-2">
        <Text as="label" size="2" weight="medium">
          Name
        </Text>
        <TextField.Root
          placeholder="Cool Project"
          name="name"
          defaultValue={project?.name}
          required
        />
      </div>

      <Separator size="4" />

      <footer className="flex justify-end">
        <Button type="submit">
          <SaveIcon className="size-4" />
          {project ? "Update" : "Create"} Project
        </Button>
      </footer>
    </form>
  );
};

export default ProjectForm;
