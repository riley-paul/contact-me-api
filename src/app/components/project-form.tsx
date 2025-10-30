import type { ProjectSelect } from "@/lib/types";
import React from "react";
import { PlusIcon, SaveIcon, XIcon } from "lucide-react";
import { Badge, Button, IconButton, Text, TextField } from "@radix-ui/themes";

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
        <div className="flex flex-wrap gap-2">
          {project?.emails.map((e) => (
            <Badge size="3" key={e.id} className="h-8">
              {e.email}
              <IconButton color="red" size="1" variant="ghost">
                <XIcon className="size-3" />
              </IconButton>
            </Badge>
          ))}
          <TextField.Root
            size="2"
            variant="soft"
            name="email"
            type="email"
            placeholder="user@example.com"
          >
            <TextField.Slot side="right">
              <IconButton size="1" variant="ghost">
                <PlusIcon className="size-3" />
              </IconButton>
            </TextField.Slot>
          </TextField.Root>
        </div>
        <Text size="1" color="gray">
          Add emails for form submission notifications. Separate multiple emails
          with commas
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
