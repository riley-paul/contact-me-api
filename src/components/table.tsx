import React from "react";
import { flexRender, type Table as TableType } from "@tanstack/react-table";
import { ScrollArea, Table as TableComponent } from "@radix-ui/themes";
import { cn } from "@/lib/client/utils";

type Props<T> = {
  table: TableType<T>;
};

function Table<T>({ table }: Props<T>) {
  return (
    <ScrollArea>
      <TableComponent.Root size="1">
        <TableComponent.Header>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableComponent.Row key={headerGroup.id}>
              {headerGroup.headers.map((header, idx) => (
                <TableComponent.ColumnHeaderCell
                  key={header.id}
                  style={{ width: header.column.getSize() }}
                  className={cn({
                    "pl-6!": idx === 0,
                    "pr-6!": idx === headerGroup.headers.length - 1,
                  })}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableComponent.ColumnHeaderCell>
              ))}
            </TableComponent.Row>
          ))}
        </TableComponent.Header>
        <TableComponent.Body>
          {table.getRowModel().rows.map((row) => (
            <TableComponent.Row
              key={row.id}
              className="hover:bg-gray-3 px-6 transition-colors ease-out"
            >
              {row.getVisibleCells().map((cell, idx) => (
                <TableComponent.Cell
                  key={cell.id}
                  style={{ width: cell.column.getSize() }}
                  className={cn({
                    "pl-6!": idx === 0,
                    "pr-6!": idx === row.getVisibleCells().length - 1,
                  })}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableComponent.Cell>
              ))}
            </TableComponent.Row>
          ))}
        </TableComponent.Body>
      </TableComponent.Root>
    </ScrollArea>
  );
}

export default Table;
