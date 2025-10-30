import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import React, { useState } from "react";
import RadixProvider from "./radix-provider";
import { PlusIcon } from "lucide-react";
import { actions } from "astro:actions";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

type Props = { projectId: string };

const ProjectEmailAdd: React.FC<Props> = ({ projectId }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <RadixProvider asChild>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger>
          <Button variant="soft">
            <PlusIcon className="size-5" />
            Add Email
          </Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <form
            className="grid gap-6"
            onSubmit={async (e) => {
              e.preventDefault();
              await actions.projectEmails.create.orThrow({
                name,
                email,
                projectId,
              });
              await router.invalidate();
              toast.success("Project email added successfully!");
              setOpen(false);
            }}
          >
            <header>
              <Dialog.Title>Add Project Email</Dialog.Title>
              <Dialog.Description size="2" color="gray">
                Add a new email address to receive contact form submissions for
                this project.
              </Dialog.Description>
            </header>

            <Flex direction="column" gap="3">
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Name
                </Text>
                <TextField.Root
                  required
                  placeholder="John Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Email
                </Text>
                <TextField.Root
                  required
                  placeholder="johnsmith@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </Flex>

            <Flex gap="3" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button type="submit">Save</Button>
            </Flex>
          </form>
        </Dialog.Content>
      </Dialog.Root>
    </RadixProvider>
  );
};

export default ProjectEmailAdd;
