import { Card, Heading, Button, Text, TextField } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import { actions } from "astro:actions";
import { CopyIcon, KeyIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";

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

  const handleCopyId = () => {
    copy(project.id);
    toast.success("Access key copied to clipboard", {
      description: project.id,
    });
  };

  return (
    <React.Fragment>
      <Card size="3" className="grid gap-6">
        <header>
          <span className="flex items-center gap-2">
            <KeyIcon className="text-accent-11 size-5" />
            <Heading as="h3" size="4">
              Access Key
            </Heading>
          </span>
          <Text size="2" color="gray">
            Your unique access key to send form submissions
          </Text>
        </header>
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
      </Card>
    </React.Fragment>
  );
}
