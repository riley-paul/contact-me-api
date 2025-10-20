import { Button, Popover } from "@radix-ui/themes";
import React from "react";
import RadixProvider from "./radix-provider";
import { PlusIcon } from "lucide-react";

type Props = { projectId: string };

const ProjectEmailAdd: React.FC<Props> = ({ projectId }) => {
  return (
    <RadixProvider asChild>
      <Popover.Root>
        <Popover.Trigger>
          <Button variant="soft">
            <PlusIcon className="size-5" />
            Add Email
          </Button>
        </Popover.Trigger>
        <Popover.Content side="bottom" align="end">
          Add email form
        </Popover.Content>
      </Popover.Root>
    </RadixProvider>
  );
};

export default ProjectEmailAdd;
