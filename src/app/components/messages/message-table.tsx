import type { MessageSelect } from "@/lib/types";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import React from "react";
import Datatable from "../ui/datatable";
import MessageActions from "./message-actions";

type Props = { messages: MessageSelect[]; className?: string };

const columnHelper = createColumnHelper<MessageSelect>();

const columns = [
  columnHelper.accessor("name", {
    header: "Sender Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("email", {
    header: "Sender Email",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("content", {
    header: "Message",
    cell: (info) => <span className="line-clamp-2"> {info.getValue()}</span>,
  }),
  columnHelper.accessor("createdAt", {
    header: "Received At",
    cell: (info) => new Date(info.getValue()).toLocaleString(),
  }),
  columnHelper.display({
    id: "actions",
    cell: (info) => <MessageActions message={info.row.original} />,
  }),
] as ColumnDef<MessageSelect>[];

const MessageTable: React.FC<Props> = ({ messages, className }) => {
  return <Datatable data={messages} columns={columns} className={className} />;
};

export default MessageTable;
