import type { MessageSelect, PaginationInfo } from "@/lib/types";
import { Badge, IconButton, Table, Text } from "@radix-ui/themes";
import { ArrowRightIcon } from "lucide-react";
import React from "react";

import { intlFormatDistance } from "date-fns";
import PaginationFooter from "./pagination-footer";
import { Link } from "@tanstack/react-router";

type Props = {
  messages: MessageSelect[];
  pagination: PaginationInfo;
  showProject?: boolean;
  setPage: (page: number) => void;
};

const MessageTable: React.FC<Props> = ({
  messages,
  pagination,
  showProject,
  setPage,
}) => {
  return (
    <div className="grid gap-4">
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Content</Table.ColumnHeaderCell>
            {showProject && (
              <Table.ColumnHeaderCell>Project</Table.ColumnHeaderCell>
            )}
            <Table.ColumnHeaderCell>Recieved</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {messages.map((message) => (
            <Table.Row key={message.id}>
              <Table.RowHeaderCell>{message.name}</Table.RowHeaderCell>
              <Table.Cell>{message.email}</Table.Cell>
              <Table.Cell>
                <span className="line-clamp-2 max-w-sm">{message.content}</span>
              </Table.Cell>
              {showProject && (
                <Table.Cell>
                  <Badge variant="soft" asChild>
                    <a href={`/projects/${message.projectId}`}>
                      {message.project.name}
                    </a>
                  </Badge>
                </Table.Cell>
              )}
              <Table.Cell>
                <Text truncate>
                  {intlFormatDistance(message.createdAt, new Date())}
                </Text>
              </Table.Cell>
              <Table.Cell className="text-end align-middle">
                <IconButton radius="full" variant="ghost" asChild>
                  <Link
                    to="/messages/$messageId"
                    params={{ messageId: message.id }}
                  >
                    <ArrowRightIcon className="size-4" />
                  </Link>
                </IconButton>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <PaginationFooter pagination={pagination} setPage={setPage} />
    </div>
  );
};

export default MessageTable;
