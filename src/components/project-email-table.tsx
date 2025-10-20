import type { ProjectEmailSelect } from "@/lib/types";
import { IconButton, Table } from "@radix-ui/themes";
import { useAtom } from "jotai";
import { Trash2Icon } from "lucide-react";
import React from "react";
import { deleteConfirmAtom } from "./delete-confirm";

type Props = { projectEmails: ProjectEmailSelect[] };

const ProjectEmailTable: React.FC<Props> = ({ projectEmails }) => {
  const [, setDeleteConfirm] = useAtom(deleteConfirmAtom);

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
                onClick={() =>
                  setDeleteConfirm({
                    open: true,
                    onConfirm: () => {},
                  })
                }
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
