import { atom, useAtom } from "jotai";
import React from "react";
import { Trash2Icon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

type DeleteConfirmState =
  | { open: false }
  | { open: true; onConfirm: () => void };

export const deleteConfirmAtom = atom<DeleteConfirmState>({ open: false });

const DeleteConfirm: React.FC = () => {
  const [state, setState] = useAtom(deleteConfirmAtom);
  return (
    <AlertDialog
      open={state.open}
      onOpenChange={(open) => {
        if (!open) setState({ open });
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm delete</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={(e) => {
              e.preventDefault();
              state.open && state.onConfirm();
              setState({ open: false });
            }}
          >
            <Trash2Icon className="size-4" />
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirm;
