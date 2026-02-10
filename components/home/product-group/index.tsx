import { Button } from "@/components/ui/button";
import {
  type ProductGroup,
  useDeleteProductGroup,
  useProductGroup,
} from "@/lib/query/product-group";
import { Edit2, Loader, Trash2 } from "lucide-react";
import Link from "next/link";
import { ProductGroupFormDialogWrapper } from "./product-group-form-dialog";
import { formatDate } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConfirmAlertDialog } from "@/components/ui/delete-confirm-alert";

export default function ProductGroupList() {
  const { data: productGroups, isLoading: isLoadingProductGroups } =
    useProductGroup();
  const data = productGroups?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Product Groups
          </h1>
          <p className="text-sm text-gray-500">
            Organize items and track product costs.
          </p>
        </div>
        <ProductGroupFormDialogWrapper mode="create">
          <Button className="w-full sm:w-auto">Create Product Group</Button>
        </ProductGroupFormDialogWrapper>
      </div>

      {isLoadingProductGroups ? (
        <div className="flex justify-center items-center h-full">
          <Loader className="size-4 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {data.map((productGroup) => (
            <ProductGroupCard
              key={productGroup._id}
              productGroup={productGroup}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export const ProductGroupCard = ({
  productGroup,
}: {
  productGroup: ProductGroup;
}) => {
  const { mutateAsync: deleteProductGroup, isPending: isDeletingProductGroup } =
    useDeleteProductGroup(productGroup._id);
  return (
    <Card
      key={productGroup._id}
      className="group border-gray-200/70 0 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-md"
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg font-semibold">
            {productGroup.name}
          </CardTitle>
          <div className="flex items-center gap-2">
            <ProductGroupFormDialogWrapper
              mode="edit"
              productGroup={productGroup}
            >
              <Button variant="outline" size="icon-sm">
                <Edit2 />
              </Button>
            </ProductGroupFormDialogWrapper>
            <ConfirmAlertDialog
              onConfirm={deleteProductGroup}
              isLoading={isDeletingProductGroup}
            >
              <Button
                variant="outline"
                size="icon-sm"
                disabled={isDeletingProductGroup}
              >
                <Trash2 />
              </Button>
            </ConfirmAlertDialog>
          </div>
        </div>
        <CardDescription className="text-sm text-gray-500">
          {productGroup.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
          <p className="text-gray-500">Number of Products</p>
          <span className="font-medium text-gray-900">
            {productGroup.productCount}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
          <p className="text-gray-500">Total Cost</p>
          <span className="font-medium text-gray-900">
            {productGroup.totalCost}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
          <p className="text-gray-500">Last Updated</p>
          <span className="font-medium text-gray-900">
            {formatDate(productGroup.updatedAt, "dd/MM/yyyy HH:mm")}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/product-group/${productGroup._id}`} className="w-full">
          <Button className="w-full transition-colors duration-200 group-hover:bg-primary/90">
            View Products
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
