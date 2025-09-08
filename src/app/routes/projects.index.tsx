import { createFileRoute } from "@tanstack/react-router";
import ProjectList from "../components/projects/project-list";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { ProjectSelect } from "@/lib/types";
import Table from "../components/table";
import { qProjects } from "@/lib/client/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Text } from "@radix-ui/themes";

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
];

export const Route = createFileRoute("/projects/")({
  component: RouteComponent,
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(qProjects);
  },
});

function RouteComponent() {
  const { data } = useSuspenseQuery(qProjects);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return <Table table={table} />;
}
