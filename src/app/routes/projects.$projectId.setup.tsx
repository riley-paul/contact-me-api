import { createFileRoute } from "@tanstack/react-router";
import { actions } from "astro:actions";
import { Code2Icon, CopyIcon, KeyIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import CustomCard from "@/app/components/ui/custom-card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from "../components/ui/input-group";

export const Route = createFileRoute("/projects/$projectId/setup")({
  component: RouteComponent,
  loader: async ({ params: { projectId } }) => {
    const project = await actions.projects.getOne.orThrow({ projectId });
    return { project, crumb: "Setup" };
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
        subtitle="Use this unique access key in your frontend application to send form
        submissions to this project"
        icon={KeyIcon}
      >
        <InputGroup>
          <InputGroupInput className="font-mono" readOnly value={project.id} />
          <InputGroupAddon align="inline-end">
            <InputGroupButton onClick={handleCopyId}>
              <CopyIcon className="size-4" />
              Copy
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </CustomCard>

      <CustomCard
        title="Implementation Examples"
        subtitle="Copy the code snippet to get started"
        icon={Code2Icon}
      >
        <InputGroup>
          <InputGroupTextarea
            className="font-mono"
            readOnly
            value={formExample}
          />
          <InputGroupAddon align="block-end" className="justify-end">
            <InputGroupButton onClick={handleCopyFormExample}>
              <CopyIcon className="size-4" />
              Copy
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </CustomCard>
    </React.Fragment>
  );
}
