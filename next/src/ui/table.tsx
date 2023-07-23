import { flexRender, Table } from "@tanstack/react-table";
import type { FC } from "react";

const Table: FC<{ table: Table<any> }> = ({ table }) => (
  <table>
    <thead>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th key={header.id}>
              {header.isPlaceholder
                ? null
                : flexRender(header.column.columnDef.header, header.getContext())}
            </th>
          ))}
        </tr>
      ))}
    </thead>
    <tbody>
      {table.getRowModel().rows.map((row) => (
        <tr key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export default Table;
