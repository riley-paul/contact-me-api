import React from "react";
import { flexRender, type Table as TableType } from "@tanstack/react-table";
import { Table as TableComponent } from "@radix-ui/themes";

type Props<T> = {
  table: TableType<T>;
};

function Table<T>({ table }: Props<T>) {
  return (
    <TableComponent.Root size="1">
      <TableComponent.Header>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableComponent.Row key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableComponent.ColumnHeaderCell key={header.id}>
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
            className="hover:bg-gray-3 transition-colors"
          >
            {row.getVisibleCells().map((cell) => (
              <TableComponent.Cell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableComponent.Cell>
            ))}
          </TableComponent.Row>
        ))}
      </TableComponent.Body>
    </TableComponent.Root>
  );
}

export default Table;
