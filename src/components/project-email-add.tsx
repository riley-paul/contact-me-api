import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import React from "react";
import RadixProvider from "./radix-provider";
import { PlusIcon } from "lucide-react";
import { actions } from "astro:actions";

type Props = { projectId: string };

const ProjectEmailAdd: React.FC<Props> = ({ projectId }) => {
  return (
    <RadixProvider asChild>
      <Dialog.Root>
        <Dialog.Trigger>
          <Button variant="soft">
            <PlusIcon className="size-5" />
            Add Email
          </Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <form action={actions.projectEmails.create}>
            <Dialog.Title>Add Project Email</Dialog.Title>
            <Dialog.Description size="2" mb="4">
              Add a new email address to receive contact form submissions for
              this project.
            </Dialog.Description>

            <Flex direction="column" gap="3">
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Name
                </Text>
                <TextField.Root required placeholder="John Smith" />
              </label>
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Email
                </Text>
                <TextField.Root required placeholder="johnsmith@example.com" />
              </label>
              <input hidden readOnly name="projectId" value={projectId} />
            </Flex>

            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray">
                  Cancel
                </Button>
              </Dialog.Close>
              <Dialog.Close>
                <Button>Save</Button>
              </Dialog.Close>
            </Flex>
          </form>
        </Dialog.Content>
      </Dialog.Root>
    </RadixProvider>
  );
};

export default ProjectEmailAdd;
