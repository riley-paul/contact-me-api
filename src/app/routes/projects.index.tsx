import { createFileRoute } from "@tanstack/react-router";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { ProjectSelect } from "@/lib/types";
import Table from "../components/table";
import { qProjects } from "@/lib/client/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DropdownMenu, IconButton, Text } from "@radix-ui/themes";
import EmptyState from "../components/empty-state";
import { DeleteIcon, Edit2Icon, MoreHorizontalIcon } from "lucide-react";
import ProjectMenu from "../components/project/project-menu";

const columnHelper = createColumnHelper<ProjectSelect>();

const columns = [
  columnHelper.accessor("identifier", {
    header: "Identifier",
    cell: (info) => <Text className="font-mono">{info.getValue()}</Text>,
    size: 100,
  }),
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("description", {
    header: "Description",
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: "context-menu",
    cell: (info) => (
      <div className="flex justify-end">
        <ProjectMenu project={info.row.original} />
      </div>
    ),
  }),
];

export const Route = createFileRoute("/projects/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { search } = Route.useSearch();
  const { data } = useSuspenseQuery(qProjects(search));

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (data.length === 0) {
    return <EmptyState isSearching={Boolean(search)} />;
  }

  return <Table table={table} />;
}
