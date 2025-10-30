import { Button, Text, TextField, IconButton } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import { actions } from "astro:actions";
import { Code2Icon, CopyIcon, KeyIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import CustomCard from "../components/ui/custom-card";

export const Route = createFileRoute("/projects/$projectId/setup")({
  component: RouteComponent,
  loader: async ({ params: { projectId } }) => {
    const project = await actions.projects.getOne.orThrow({ projectId });
    return { project };
  },
});

function RouteComponent() {
  const { project } = Route.useLoaderData();

  const [, copy] = useCopyToClipboard();

  const formExample = `<form action="https://contact-me-api.pages.dev/contact" method="POST">
  <input type="hidden" name="access_key" value="${project.id}">
  <input type="text" name="name" required>
  <input type="email" name="email" required>
  <textarea name="message" required></textarea>
  <button type="submit">Submit Form</button>
</form>`;

  const handleCopyId = () => {
    copy(project.id);
    toast.success("Access key copied to clipboard", {
      description: project.id,
    });
  };

  const handleCopyFormExample = () => {
    copy(formExample);
    toast.success("Form example copied to clipboard");
  };

  return (
    <React.Fragment>
      <CustomCard
        title="Access Key"
        subtitle="Your unique access key to send form submissions"
        icon={KeyIcon}
      >
        <TextField.Root
          size="3"
          className="font-mono"
          readOnly
          value={project.id}
        >
          <TextField.Slot side="right">
            <Button
              onClick={handleCopyId}
              size="2"
              variant="ghost"
              className="font-sans"
            >
              <CopyIcon className="size-4" />
              Copy
            </Button>
          </TextField.Slot>
        </TextField.Root>
        <Text size="2" color="gray">
          Use this access key in your frontend application to send form
          submissions to this project.
        </Text>
      </CustomCard>

      <CustomCard
        title="Implementation Examples"
        subtitle="Copy the code snippet to get started"
        icon={Code2Icon}
      >
        <pre className="bg-gray-3 text-2 rounded-3 relative overflow-x-auto p-4 font-mono">
          {formExample}
          <IconButton
            onClick={handleCopyFormExample}
            size="2"
            variant="surface"
            className="absolute top-2 right-2"
          >
            <CopyIcon className="size-4" />
          </IconButton>
        </pre>
      </CustomCard>
    </React.Fragment>
  );
}
