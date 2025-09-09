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
import {
  Code,
  DropdownMenu,
  IconButton,
  Text,
  Tooltip,
} from "@radix-ui/themes";
import EmptyState from "../components/empty-state";
import { DeleteIcon, Edit2Icon, MoreHorizontalIcon } from "lucide-react";
import ProjectMenu from "../components/project/project-menu";

const columnHelper = createColumnHelper<ProjectSelect>();

const columns = [
  columnHelper.accessor("identifier", {
    header: "Identifier",
    cell: (info) => (
      <Tooltip content={info.getValue()} side="right">
        <Code
          color="gray"
          className="block w-fit max-w-40 truncate px-2! py-1!"
        >
          {info.getValue()}
        </Code>
      </Tooltip>
    ),
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
  columnHelper.accessor("repoUrl", {
    header: "Repo URL",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("liveUrl", {
    header: "Live URL",
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: "context-menu",
    cell: (info) => (
      <div className="flex justify-end">
        <ProjectMenu project={info.row.original} />
      </div>
    ),
    maxSize: 50,
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
