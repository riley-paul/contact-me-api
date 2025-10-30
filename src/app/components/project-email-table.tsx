import type { ProjectEmailSelect } from "@/lib/types";
import { IconButton, Table } from "@radix-ui/themes";
import { useAtom } from "jotai";
import { Trash2Icon } from "lucide-react";
import React from "react";
import { deleteConfirmAtom } from "./delete-confirm";
import { actions } from "astro:actions";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

type Props = { projectEmails: ProjectEmailSelect[] };

const ProjectEmailTable: React.FC<Props> = ({ projectEmails }) => {
  const [, setDeleteConfirm] = useAtom(deleteConfirmAtom);
  const router = useRouter();

  const handleDelete = (projectEmailId: string) => {
    setDeleteConfirm({
      open: true,
      onConfirm: async () => {
        await actions.projectEmails.remove({ projectEmailId });
        await router.invalidate();
        setDeleteConfirm({ open: false });
        toast.success("Email removed from project");
      },
    });
  };

  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {projectEmails.map((email) => (
          <Table.Row key={email.id}>
            <Table.Cell>{email.name}</Table.Cell>
            <Table.Cell>{email.email}</Table.Cell>
            <Table.Cell className="text-end align-middle">
              <IconButton
                variant="ghost"
                color="red"
                onClick={() => handleDelete(email.id)}
              >
                <Trash2Icon className="size-4" />
              </IconButton>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

export default ProjectEmailTable;
