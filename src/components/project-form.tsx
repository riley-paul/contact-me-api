import type { ProjectSelect } from "@/lib/types";
import React from "react";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";
import { SaveIcon } from "lucide-react";

type Props = {
  project?: ProjectSelect;
};

const ProjectForm: React.FC<Props> = ({ project }) => {
  return (
    <form className="grid gap-6">
      <Field>
        <FieldLabel>Name</FieldLabel>
        <Input
          placeholder="Cool Project"
          name="name"
          defaultValue={project?.name}
          required
        />
      </Field>

      <Field>
        <FieldLabel>Identifier </FieldLabel>
        <FieldDescription>
          A unique identifier for the project (e.g., "cool-project"). This will
          be used in the form on your site.
        </FieldDescription>
        <Input
          placeholder="cool-project"
          name="identifier"
          defaultValue={project?.identifier}
          required
        />
      </Field>

      <Field>
        <FieldLabel>Description</FieldLabel>
        <Textarea
          placeholder="A short description"
          name="description"
          defaultValue={project?.description ?? undefined}
        />
      </Field>

      <FieldSeparator />

      <FieldGroup>
        <Field>
          <FieldLabel>Live URL</FieldLabel>
          <FieldDescription>
            The URL where the project is hosted (if applicable).
          </FieldDescription>
          <Input
            placeholder="https://example.com"
            name="liveUrl"
            defaultValue={project?.liveUrl ?? undefined}
          />
        </Field>
        <Field>
          <FieldLabel>Repository URL</FieldLabel>
          <FieldDescription>
            The URL of the project's source code repository (if applicable).
          </FieldDescription>
          <Input
            placeholder="https://github.com/username/repo"
            name="repoUrl"
            defaultValue={project?.repoUrl ?? undefined}
          />
        </Field>
      </FieldGroup>

      <footer className="flex justify-end">
        <Button type="submit">
          <SaveIcon />
          {project ? "Update" : "Create"} Project
        </Button>
      </footer>
    </form>
  );
};

export default ProjectForm;
