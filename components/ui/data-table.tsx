// components/ui/data-table.tsx
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { Dispatch, SetStateAction } from "react";

interface DataTableProps<TData, TValue> {
  isLoading?: boolean;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  emptyMessage?: string;
  globalFilter?: string; // ✅ new
  maxHeight?: string;
  rowSelection?: RowSelectionState;
  setRowSelection?: Dispatch<SetStateAction<RowSelectionState>>;
  limit?: number;
  className?: string;
}

export function DataTable<TData, TValue>({
  isLoading,
  columns,
  data,
  maxHeight = "",
  emptyMessage = "No results found.",
  globalFilter = "", // ✅ default empty
  rowSelection,
  setRowSelection,
  limit,
  className,
}: DataTableProps<TData, TValue>) {
  const isRowSelectionEnabled =
    rowSelection !== undefined && setRowSelection !== undefined;

  // TODO: When data has unique `id` field, configure `getRowId: (row) => row.id`
  // to use ID-based selection instead of index-based selection
  const selectColumn: ColumnDef<TData, TValue> = {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };

  const finalColumns = isRowSelectionEnabled
    ? [selectColumn, ...columns]
    : columns;

  const table = useReactTable({
    data,
    columns: finalColumns,
    state: {
      globalFilter,
      rowSelection: rowSelection ?? {},
    },
    globalFilterFn: (row, columnId, filterValue) => {
      return String(row.getValue(columnId))
        .toLowerCase()
        .includes(filterValue.toLowerCase());
    },
    onRowSelectionChange: setRowSelection,
    enableRowSelection: (row) => {
      if (!isRowSelectionEnabled) return false;
      if (!limit) return true;
      if (row.getIsSelected()) return true;
      const selectedCount = Object.keys(rowSelection ?? {}).length;
      return selectedCount < limit;
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className={cn("rounded-md shadow-sm", className)}>
      <Table maxHeight={maxHeight}>
        <TableHeader className="bg-card">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  className="font-medium text-sm lg:text-base border border-primary "
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody className="bg-muted">
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                Loading Table Data...
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => {
              const canSelect = row.getCanSelect();
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    isRowSelectionEnabled && !canSelect && "opacity-50",
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="text-sm lg:text-base border border-primary/60 rounded-md"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
