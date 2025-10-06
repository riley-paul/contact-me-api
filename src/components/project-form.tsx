import type { ProjectSelect } from "@/lib/types";
import { Button, Text, TextArea, TextField } from "@radix-ui/themes";
import { actions } from "astro:actions";
import React from "react";

type Props = {
  project?: ProjectSelect;
};

const ProjectForm: React.FC<Props> = ({ project }) => {
  return (
    <form
      className="grid gap-6"
      action={project ? actions.projects.update : actions.projects.create}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Text as="label" size="2" weight="medium" className="grid gap-1">
          <span>Name</span>
          <TextField.Root
            placeholder="Cool Project"
            name="name"
            defaultValue={project?.name}
            required
          />
        </Text>
        <Text as="label" size="2" weight="medium" className="grid gap-1">
          <span>Identifier</span>
          <TextField.Root
            placeholder="cool-project"
            name="identifier"
            defaultValue={project?.identifier}
            required
          />
        </Text>
      </div>

      <Text as="label" size="2" weight="medium" className="grid gap-1">
        <span>Description</span>
        <TextArea
          placeholder="A short description"
          name="description"
          defaultValue={project?.description ?? undefined}
        />
      </Text>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Text as="label" size="2" weight="medium" className="grid gap-1">
          <span>Live URL</span>
          <TextField.Root
            placeholder="https://example.com"
            name="liveUrl"
            defaultValue={project?.liveUrl ?? undefined}
          />
        </Text>
        <Text as="label" size="2" weight="medium" className="grid gap-1">
          <span>Repository URL</span>
          <TextField.Root
            placeholder="https://github.com/username/repo"
            name="repoUrl"
            defaultValue={project?.repoUrl ?? undefined}
          />
        </Text>
      </div>
      <footer className="flex justify-end">
        <Button type="submit">Create Project</Button>
      </footer>
    </form>
  );
};

export default ProjectForm;
