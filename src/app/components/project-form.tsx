import {
  type ProjectInsert,
  zProjectInsert,
  type ProjectSelect,
} from "@/lib/types";
import React from "react";
import { SaveIcon } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { actions } from "astro:actions";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "astro/zod";
import { Button } from "./ui/button";
import { Field, FieldDescription, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import TagInput from "./tag-input";

type Props = {
  project?: ProjectSelect;
  onSuccess?: (project: ProjectSelect) => void;
};

const ProjectForm: React.FC<Props> = ({ project, onSuccess }) => {
  const router = useRouter();

  const defaultValues: ProjectInsert = {
    name: project?.name || "",
    emails: project?.emails || "",
    allowedOrigins: project?.allowedOrigins || "",
    allowedRedirects: project?.allowedRedirects || "",
  };

  const {
    Field: FormField,
    Subscribe,
    handleSubmit,
  } = useForm({
    defaultValues,
    validators: { onChange: zProjectInsert },
    onSubmit: async ({ value }) => {
      if (project) {
        const newProject = await actions.projects.update.orThrow({
          projectId: project.id,
          data: value,
        });
        onSuccess?.(newProject);
        toast.success("Project updated successfully");
        router.invalidate();
      } else {
        const updatedProject = await actions.projects.create.orThrow({
          data: value,
        });
        onSuccess?.(updatedProject);
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
      }}
      className="flex flex-col gap-8"
    >
      <Field>
        <FieldLabel htmlFor="name">Project name</FieldLabel>
        <FieldDescription>
          Give your project a descriptive name to easily identify it.
        </FieldDescription>
        <FormField name="name">
          {({ state, handleBlur, handleChange }) => (
            <React.Fragment>
              <Input
                placeholder="Cool Project"
                defaultValue={state.value}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={handleBlur}
                required
              />
              {state.meta.errors.length > 0 && (
                <p className="text-destructive text-sm">
                  {state.meta.errors[0]?.message}
                </p>
              )}
            </React.Fragment>
          )}
        </FormField>
      </Field>

      <Field>
        <FieldLabel>Additional Recipient Email Addresses</FieldLabel>
        <FieldDescription>
          Add additional emails for receiving form submission notifications.
          Note that the owner of the project (you) will always receive an email
          notification.
        </FieldDescription>
        <FormField name="emails">
          {({ state, handleChange }) => (
            <React.Fragment>
              <TagInput
                value={(state.value || "").split(",").filter((e) => e.trim())}
                onChange={(values) => handleChange(values.join(","))}
                placeholder="user@example.com"
                inputType="email"
                validate={(email) => {
                  const result = z.string().email().safeParse(email);
                  return {
                    isValid: result.success,
                    errorMessage: result.success
                      ? undefined
                      : "Invalid email address",
                  };
                }}
              />
              {state.meta.errors.length > 0 && (
                <p className="text-destructive text-sm">
                  {state.meta.errors[0]?.message}
                </p>
              )}
            </React.Fragment>
          )}
        </FormField>
      </Field>

      <Field>
        <FieldLabel>Allowed Origins</FieldLabel>
        <FieldDescription>
          Specify which domains are allowed to submit forms to this project.
          Leave empty to allow all origins.
        </FieldDescription>
        <FormField name="allowedOrigins">
          {({ state, handleChange }) => (
            <React.Fragment>
              <TagInput
                value={(state.value || "").split(",").filter((e) => e.trim())}
                onChange={(values) => handleChange(values.join(","))}
                placeholder="https://example.com"
                inputType="url"
                validate={(origin) => {
                  try {
                    new URL(origin);
                    return { isValid: true };
                  } catch {
                    return {
                      isValid: false,
                      errorMessage: "Invalid URL format",
                    };
                  }
                }}
              />
              {state.meta.errors.length > 0 && (
                <p className="text-destructive text-sm">
                  {state.meta.errors[0]?.message}
                </p>
              )}
            </React.Fragment>
          )}
        </FormField>
      </Field>

      <Field>
        <FieldLabel>Allowed Redirect Domains</FieldLabel>
        <FieldDescription>
          Specify which domains are allowed for redirect URLs after form
          submission. Leave empty to allow all domains.
        </FieldDescription>
        <FormField name="allowedRedirects">
          {({ state, handleChange }) => (
            <React.Fragment>
              <TagInput
                value={(state.value || "").split(",").filter((e) => e.trim())}
                onChange={(values) => handleChange(values.join(","))}
                placeholder="example.com"
                validate={(domain) => {
                  // Basic domain validation
                  const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
                  const isValid = domainRegex.test(domain);
                  return {
                    isValid,
                    errorMessage: isValid ? undefined : "Invalid domain format",
                  };
                }}
              />
              {state.meta.errors.length > 0 && (
                <p className="text-destructive text-sm">
                  {state.meta.errors[0]?.message}
                </p>
              )}
            </React.Fragment>
          )}
        </FormField>
      </Field>

      <footer className="flex justify-end">
        <Subscribe
          selector={({ canSubmit, isDirty }) => ({ canSubmit, isDirty })}
        >
          {({ canSubmit, isDirty }) => (
            <Button size="lg" disabled={!canSubmit || !isDirty}>
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
