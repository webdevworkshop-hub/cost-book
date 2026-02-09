import { DataTable } from "@/components/ui/data-table";
import { productColumns } from "./columns";
import {
  type Product,
  useDeleteProduct,
  useProducts,
} from "@/lib/query/product";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { ProductFormDialogWrapper } from "./product-form-dialog";

export const ProductTable = ({ groupid }: { groupid: string }) => {
  const { data: productResponse, isLoading } = useProducts(groupid);
  const data = productResponse?.data.products || [];
  const totalAmount = productResponse?.data.productGroupInfo.totalAmount || 0;
  return (
    <div>
      <h1 className="text-2xl font-medium">
        Table Name :{" "}
        <span className="text-primary">
          {productResponse?.data.productGroupInfo.name}
        </span>
      </h1>

      <div className="mt-4 shad rounded-md border shadow-sm">
        <DataTable
          columns={productColumns}
          data={data}
          isLoading={isLoading}
          maxHeight="max-h-[500px]"
          emptyMessage="No products found"
        />
      </div>
      <div className="mt-4 p-3 rounded-md border shadow-sm flex items-center justify-between">
        <h2 className="text-lg font-bold">Total Amount</h2>
        <p className="text-2xl font-bold text-primary">{totalAmount}</p>
      </div>
    </div>
  );
};

export const ProductTableActions = ({
  product,
  groupid,
}: {
  product: Product;
  groupid: string;
}) => {
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct(
    groupid,
    product._id,
  );
  return (
    <div className="flex items-center gap-2">
      <ProductFormDialogWrapper mode="edit" product={product}>
        <Button>
          <Edit2 />
        </Button>
      </ProductFormDialogWrapper>
      <Button onClick={() => deleteProduct()} disabled={isDeleting}>
        <Trash2 />
      </Button>
    </div>
  );
};
