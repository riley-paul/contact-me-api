import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import { atom, useAtom } from "jotai";
import React from "react";
import RadixProvider from "./radix-provider";
import { Trash2Icon } from "lucide-react";

type DeleteConfirmState =
  | { open: false }
  | { open: true; onConfirm: () => void };

export const deleteConfirmAtom = atom<DeleteConfirmState>({ open: false });

const DeleteConfirm: React.FC = () => {
  const [state, setState] = useAtom(deleteConfirmAtom);
  return (
    <RadixProvider asChild>
      <AlertDialog.Root
        open={state.open}
        onOpenChange={(open) => {
          if (!open) setState({ open });
        }}
      >
        <AlertDialog.Content maxWidth="450px">
          <AlertDialog.Title>Confirm delete</AlertDialog.Title>
          <AlertDialog.Description size="2">
            Are you sure you want to delete? This action cannot be undone.
          </AlertDialog.Description>

          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button
                variant="solid"
                color="red"
                onClick={(e) => {
                  e.preventDefault();
                  state.open && state.onConfirm();
                }}
              >
                <Trash2Icon className="size-4" />
                Delete
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </RadixProvider>
  );
};

export default DeleteConfirm;
