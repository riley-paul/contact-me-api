import { zProjectInsert, type ProjectSelect } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextArea, TextField } from "@radix-ui/themes";
import { z } from "astro/zod";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import FieldSet from "../field-set";
import { toast } from "sonner";
import useMutations from "@/lib/client/use-mutations";

type Props = { project?: ProjectSelect; onSuccess?: () => void };

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  identifier: z.string().min(1, "Identifier is required"),
  description: z.string().nullable(),
  liveUrl: z.string().url().nullable().or(z.literal("")),
  repoUrl: z.string().url().nullable().or(z.literal("")),
});
type Schema = z.infer<typeof schema>;

const defaultValues: Schema = {
  name: "",
  description: "",
  identifier: "",
  liveUrl: null,
  repoUrl: null,
};

const ProjectForm: React.FC<Props> = ({ project, onSuccess }) => {
  const form = useForm<Schema>({
    defaultValues: { ...defaultValues, ...project },
    resolver: zodResolver(schema),
  });

  const { updateProject, createProject } = useMutations();

  const onSubmit = form.handleSubmit(
    (data) => {
      project
        ? updateProject.mutate(
            { ...data, projectId: project.id },
            { onSuccess },
          )
        : createProject.mutate(data, { onSuccess });
    },
    (errors) => {
      console.error(errors);
      toast.error("Please fix the errors in the form.");
    },
  );

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <Controller
          name="name"
          render={({ field, fieldState: { error } }) => (
            <FieldSet label="Name" error={error?.message}>
              <TextField.Root size="3" placeholder="Todos" {...field} />
            </FieldSet>
          )}
        />
        <Controller
          name="description"
          render={({ field, fieldState: { error } }) => (
            <FieldSet label="Description" error={error?.message}>
              <TextArea
                placeholder="A simple todo app"
                className="min-h-[120px] resize-none"
                {...field}
              />
            </FieldSet>
          )}
        />

        <Controller
          name="identifier"
          render={({ field, fieldState: { error } }) => (
            <FieldSet label="Identifier" error={error?.message}>
              <TextField.Root placeholder="todos" {...field} />
            </FieldSet>
          )}
        />

        <Controller
          name="liveUrl"
          render={({ field, fieldState: { error } }) => (
            <FieldSet label="Live URL" error={error?.message}>
              <TextField.Root placeholder="https://todos.com" {...field} />
            </FieldSet>
          )}
        />

        <Controller
          name="repoUrl"
          render={({ field, fieldState: { error } }) => (
            <FieldSet label="Repository URL" error={error?.message}>
              <TextField.Root
                placeholder="https://github.com/todo/todos"
                {...field}
              />
            </FieldSet>
          )}
        />

        <footer className="flex justify-end">
          <Button type="submit">
            {project ? "Update Project" : "Create Project"}
          </Button>
        </footer>
      </form>
    </FormProvider>
  );
};

export default ProjectForm;
