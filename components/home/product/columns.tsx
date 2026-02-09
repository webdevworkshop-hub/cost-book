import type { Product } from "@/lib/query/product";
import type { ColumnDef } from "@tanstack/react-table";
import { ProductTableActions } from "./product-table";
import { formatDate } from "date-fns";

export const productColumns: ColumnDef<Product>[] = [
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Description",
    accessorKey: "description",
  },
  {
    header: "Date",
    accessorKey: "createdAt",
    cell: ({ row }) => {
      return <span>{formatDate(row.original.createdAt, "dd/MM/yyyy")}</span>;
    },
  },
  {
    header: "Quantity",
    accessorKey: "quantity",
  },
  {
    header: "Price",
    accessorKey: "price",
  },
  {
    header: "Total Amount",
    accessorKey: "totalAmount",
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      return (
        <ProductTableActions
          product={row.original}
          groupid={row.original.productGroupId}
        />
      );
    },
  },
];
