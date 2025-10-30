import {
  type ProjectInsert,
  zProjectInsert,
  type ProjectSelect,
} from "@/lib/types";
import React, { useState } from "react";
import { PlusIcon, SaveIcon, XIcon } from "lucide-react";
import { Badge, Button, IconButton, Text, TextField } from "@radix-ui/themes";
import { useForm } from "@tanstack/react-form";
import { actions } from "astro:actions";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "astro/zod";
import { ACCENT_COLOR } from "@/lib/constants";

type Props = {
  project?: ProjectSelect;
  onSubmit?: () => void;
};

const EmailAdder: React.FC<{ handleAddEmail: (email: string) => void }> = ({
  handleAddEmail,
}) => {
  const [value, setValue] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = () => {
    const { error } = z.string().email().safeParse(value);
    setIsError(!!error);

    if (!value || error) {
      toast.error("Not a valid email");
      return;
    }
    handleAddEmail(value);
    setValue("");
  };

  return (
    <TextField.Root
      size="2"
      color={isError ? "red" : "gray"}
      variant="soft"
      name="email"
      placeholder="user@example.com"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          handleSubmit();
        }
      }}
    >
      <TextField.Slot side="right">
        <IconButton
          onClick={handleSubmit}
          size="1"
          variant="ghost"
          type="button"
        >
          <PlusIcon className="size-3" />
        </IconButton>
      </TextField.Slot>
    </TextField.Root>
  );
};

const ProjectForm: React.FC<Props> = ({ project, onSubmit }) => {
  const router = useRouter();

  const defaultValues: ProjectInsert = {
    name: project?.name || "",
    emails: project?.emails.map((e) => e.email) || [],
  };

  const { Field, Subscribe, handleSubmit } = useForm({
    defaultValues,
    validators: { onChange: zProjectInsert },
    onSubmit: async ({ value }) => {
      if (project) {
        await actions.projects.update.orThrow({
          projectId: project.id,
          data: value,
        });
        toast.success("Project updated successfully");
        router.invalidate();
      } else {
        await actions.projects.create.orThrow({ data: value });
        toast.success("Project created successfully");
        router.invalidate();
      }
    },
  });

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await handleSubmit();
        onSubmit?.();
      }}
      className="flex flex-col gap-8"
    >
      <div className="grid gap-2">
        <Text as="label" size="2" weight="bold" htmlFor="name">
          Name
        </Text>
        <Field name="name">
          {({ state, handleBlur, handleChange }) => (
            <React.Fragment>
              <TextField.Root
                size="3"
                variant={state.meta.isDirty ? "soft" : "surface"}
                color={state.meta.isValid ? ACCENT_COLOR : "red"}
                placeholder="Cool Project"
                defaultValue={state.value}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={handleBlur}
                required
              />
              {state.meta.errors.map((err) => (
                <Text key={err?.message} size="1" color="red">
                  {err?.message}
                </Text>
              ))}
            </React.Fragment>
          )}
        </Field>
        <Text size="1" color="gray">
          Give your project a descriptive name to easily identify it.
        </Text>
      </div>

      <div className="grid gap-2">
        <Text as="label" size="2" weight="bold" htmlFor="email">
          Recipient Email Addresses
        </Text>
        <Field name="emails">
          {({ state, pushValue, removeValue }) => (
            <React.Fragment>
              <div className="flex flex-wrap gap-2">
                {state.value.map((e, idx) => (
                  <Badge
                    color="gray"
                    size="3"
                    key={e}
                    className="text-gray-12 h-8"
                  >
                    {e}
                    <IconButton
                      color="red"
                      size="1"
                      variant="ghost"
                      type="button"
                      onClick={() => removeValue(idx)}
                    >
                      <XIcon className="size-3" />
                    </IconButton>
                  </Badge>
                ))}
                <EmailAdder handleAddEmail={pushValue} />
              </div>
              {state.meta.errors.map((err) => (
                <Text key={err?.message} size="1" color="red">
                  {err?.message}
                </Text>
              ))}
            </React.Fragment>
          )}
        </Field>
        <Text size="1" color="gray">
          Add emails for form submission notifications. Note that the owner of
          the project (you) will always receive an email notification.
        </Text>
      </div>

      <footer className="flex">
        <Subscribe
          selector={({ canSubmit, isDirty }) => ({ canSubmit, isDirty })}
        >
          {({ canSubmit, isDirty }) => (
            <Button disabled={!canSubmit || !isDirty}>
              <SaveIcon className="size-4" />
              {project ? "Update" : "Create"} Project
            </Button>
          )}
        </Subscribe>
      </footer>
    </form>
  );
};

export default ProjectForm;
