import type { ProjectSelect } from "@/lib/types";
import React from "react";
import { SaveIcon } from "lucide-react";
import { Button, Separator, Text, TextArea, TextField } from "@radix-ui/themes";

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

      <div className="grid gap-2">
        <Text as="label" size="2" weight="medium">
          Identifier
        </Text>
        <Text size="1" color="gray">
          A unique identifier for the project (e.g., "cool-project"). This will
          be used in the form on your site.
        </Text>
        <TextField.Root
          placeholder="cool-project"
          name="identifier"
          defaultValue={project?.identifier}
          required
        />
      </div>

      <div className="grid gap-2">
        <Text as="label" size="2" weight="medium">
          Description
        </Text>
        <TextArea
          placeholder="A short description"
          name="description"
          defaultValue={project?.description ?? undefined}
        />
      </div>

      <Separator size="4" />

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Text as="label" size="2" weight="medium">
            Live URL
          </Text>
          <Text size="1" color="gray">
            The URL where the project is hosted (if applicable).
          </Text>
          <TextField.Root
            placeholder="https://example.com"
            name="liveUrl"
            defaultValue={project?.liveUrl ?? undefined}
          />
        </div>
        <div className="grid gap-2">
          <Text as="label" size="2" weight="medium">
            Repository URL
          </Text>
          <Text size="1" color="gray">
            The URL of the project's source code repository (if applicable).
          </Text>
          <TextField.Root
            placeholder="https://github.com/username/repo"
            name="repoUrl"
            defaultValue={project?.repoUrl ?? undefined}
          />
        </div>
      </div>

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
