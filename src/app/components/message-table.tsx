import type { MessageSelect, PaginationInfo } from "@/lib/types";
import { ArrowRightIcon } from "lucide-react";
import React from "react";

import Pagination from "./pagination";
import { Link } from "@tanstack/react-router";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import SearchInput from "./search-input";
import { formatMessageDate } from "@/lib/utils";

type Props = {
  messages: MessageSelect[];
  showProject?: boolean;

  search: string | undefined;
  setSearch: (value: string | undefined) => void;

  pagination: PaginationInfo;
  setPage: (page: number) => void;
};

const MessageTable: React.FC<Props> = ({
  messages,
  showProject,
  search,
  setSearch,
  pagination,
  setPage,
}) => {
  return (
    <div className="grid gap-4">
      <header className="flex items-center justify-end gap-8">
        <SearchInput search={search} setSearch={setSearch} />
        <Pagination pagination={pagination} setPage={setPage} />
      </header>

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
            <TableRow
              key={message.id}
              className="group hover:bg-muted/50 transition-colors"
            >
              <TableCell className="font-medium">{message.name}</TableCell>
              <TableCell className="text-muted-foreground">
                <div className="min-w-0 truncate">{message.email}</div>
              </TableCell>
              <TableCell className="whitespace-normal">
                <div className="line-clamp-2 text-sm leading-relaxed">
                  {message.content}
                </div>
              </TableCell>
              {showProject && (
                <TableCell>
                  <Badge variant="invert" asChild>
                    <Link
                      to="/projects/$projectId"
                      params={{ projectId: message.projectId }}
                    >
                      {message.project.name}
                    </Link>
                  </Badge>
                </TableCell>
              )}
              <TableCell className="text-muted-foreground text-sm">
                {formatMessageDate(message.createdAt)}
              </TableCell>
              <TableCell className="text-end align-middle">
                <Button
                  size="icon"
                  variant="ghost"
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                  asChild
                >
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
    </div>
  );
};

export default MessageTable;
