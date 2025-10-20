import type { MessageSelect, PaginationInfo } from "@/lib/types";
import { IconButton, Table } from "@radix-ui/themes";
import { ArrowRightIcon } from "lucide-react";
import React from "react";

import { intlFormatDistance } from "date-fns";
import PaginationFooter from "./pagination-footer";

type Props = {
  messages: MessageSelect[];
  pagination: PaginationInfo;
  url: URL;
};

const MessageTable: React.FC<Props> = ({ messages, pagination, url }) => {
  return (
    <div className="grid gap-4">
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Content</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Recieved</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {messages.map((message) => (
            <Table.Row>
              <Table.RowHeaderCell>{message.name}</Table.RowHeaderCell>
              <Table.Cell>{message.email}</Table.Cell>
              <Table.Cell>
                <span className="line-clamp-2 max-w-sm">{message.content}</span>
              </Table.Cell>
              <Table.Cell>
                <span className="truncate">
                  {intlFormatDistance(message.createdAt, new Date())}
                </span>
              </Table.Cell>
              <Table.Cell>
                <IconButton radius="full" variant="soft" asChild>
                  <a href={`/messages/${message.id}`}>
                    <ArrowRightIcon className="size-4" />
                  </a>
                </IconButton>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <PaginationFooter pagination={pagination} url={url} />
    </div>
  );
};

export default MessageTable;
