import { zProjectInsert, type ProjectSelect } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextArea, TextField } from "@radix-ui/themes";
import type { z } from "astro/zod";
import React from "react";
import { useForm } from "react-hook-form";

type Props = { project?: ProjectSelect };

const schema = zProjectInsert.pick({
  name: true,
  description: true,
  identifier: true,
  liveUrl: true,
  repoUrl: true,
});
type Schema = z.infer<typeof schema>;

const defaultValues: Schema = {
  name: "",
  description: "",
  identifier: "",
  liveUrl: "",
  repoUrl: "",
};

const ProjectForm: React.FC<Props> = ({ project }) => {
  const { register, handleSubmit } = useForm<Schema>({
    defaultValues: { ...defaultValues, ...project },
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit((data) => {});

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <TextField.Root size="3" placeholder="Todos" {...register("name")} />
      <TextArea placeholder="A simple todo app" {...register("description")} />
      <TextField.Root placeholder="todos" {...register("identifier")} />
      <TextField.Root
        placeholder="https://todos.com"
        {...register("liveUrl")}
      />
      <TextField.Root
        placeholder="https://github.com/todo/todos"
        {...register("repoUrl")}
      />
      <footer className="flex justify-end">
        <Button type="submit">
          {project ? "Update Project" : "Create Project"}
        </Button>
      </footer>
    </form>
  );
};

export default ProjectForm;
