import type { MessageSelect } from "@/lib/types";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import React from "react";
import Datatable from "../ui/datatable";

type Props = { messages: MessageSelect[] };

const columnHelper = createColumnHelper<MessageSelect>();

const columns: ColumnDef<MessageSelect>[] = [
  columnHelper.accessor("name", {
    header: "Sender Name",
    cell: (info) => info.getValue(),
  }),
];

const MessageTable: React.FC<Props> = ({ messages }) => {
  return <Datatable data={messages} columns={columns} />;
};

export default MessageTable;
