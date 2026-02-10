"use client";
import { ProductFormDialogWrapper } from "@/components/home/product/product-form-dialog";
import { ProductTable } from "@/components/home/product/product-table";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams();
  return (
    <div className="p-4 max-w-7xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Product Group</h1>
        <ProductFormDialogWrapper mode="create">
          <Button>Create Product</Button>
        </ProductFormDialogWrapper>
      </div>
      <ProductTable groupid={id as string} />
    </div>
  );
}
