import type { MessageSelect, PaginationInfo } from "@/lib/types";
import { ArrowRightIcon } from "lucide-react";
import React from "react";

import { intlFormatDistance } from "date-fns";
import PaginationFooter from "./pagination-footer";
import { Link } from "@tanstack/react-router";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Content</TableHead>
            {showProject && <TableHead>Project</TableHead>}
            <TableHead>Recieved</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {messages.map((message) => (
            <TableRow key={message.id}>
              <TableCell>{message.name}</TableCell>
              <TableCell>{message.email}</TableCell>
              <TableCell>
                <span className="line-clamp-2 max-w-sm">{message.content}</span>
              </TableCell>
              {showProject && (
                <TableCell>
                  <Badge asChild>
                    <Link
                      to="/projects/$projectId"
                      params={{ projectId: message.projectId }}
                    >
                      {message.project.name}
                    </Link>
                  </Badge>
                </TableCell>
              )}
              <TableCell>
                {intlFormatDistance(message.createdAt, new Date())}
              </TableCell>
              <TableCell className="text-end align-middle">
                <Button size="icon" variant="ghost" asChild>
                  <Link
                    to="/messages/$messageId"
                    params={{ messageId: message.id }}
                  >
                    <ArrowRightIcon className="size-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <PaginationFooter pagination={pagination} setPage={setPage} />
    </div>
  );
};

export default MessageTable;
