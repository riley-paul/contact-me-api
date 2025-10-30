import type { ProjectSelect } from "@/lib/types";
import React from "react";
import { SaveIcon } from "lucide-react";
import { Button, Text, TextField } from "@radix-ui/themes";

type Props = {
  project?: ProjectSelect;
};

const ProjectForm: React.FC<Props> = ({ project }) => {
  return (
    <form className="flex flex-col gap-7">
      <div className="grid gap-2">
        <Text as="label" size="2" weight="bold" htmlFor="name">
          Name
        </Text>
        <TextField.Root
          size="3"
          placeholder="Cool Project"
          name="name"
          type="text"
          defaultValue={project?.name}
          required
        />
        <Text size="1" color="gray">
          Give your project a descriptive name to easily identify it
        </Text>
      </div>

      <div className="grid gap-2">
        <Text as="label" size="2" weight="bold" htmlFor="email">
          Recipient Email Addresses
        </Text>
        <TextField.Root
          size="3"
          name="email"
          type="email"
          defaultValue={project?.name}
          required
        />
        <Text size="1" color="gray">
          Add emails for form submission notifications
        </Text>
      </div>

      <footer className="flex">
        <Button type="submit">
          <SaveIcon className="size-4" />
          {project ? "Update" : "Create"} Project
        </Button>
      </footer>
    </form>
  );
};

export default ProjectForm;
