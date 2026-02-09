import { Button } from "@/components/ui/button";
import { useProductGroup } from "@/lib/query/product-group";
import { Loader } from "lucide-react";
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

export default function ProductGroup() {
  const { data: productGroups, isLoading: isLoadingProductGroups } =
    useProductGroup();
  const data = productGroups?.data || [];
  return (
    <div className="space-y-4">
      <h1>Product Group</h1>
      <ProductGroupFormDialogWrapper>
        <Button>Create Product Group</Button>
      </ProductGroupFormDialogWrapper>

      {isLoadingProductGroups ? (
        <div className="flex justify-center items-center h-full">
          <Loader className="size-4 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.map((productGroup) => (
            <Card key={productGroup._id}>
              <CardHeader>
                <CardTitle className="text-lg font-bold">
                  {productGroup.name}
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  {productGroup.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2 justify-between">
                  <p className="text-sm text-gray-500">Number of Products</p>
                  <span>{productGroup.productCount}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 justify-between">
                  <p className="text-sm text-gray-500">Total Cost</p>
                  <span>{productGroup.totalCost}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 justify-between">
                  <p className="text-sm text-gray-500">Created At</p>
                  <span>
                    {formatDate(productGroup.createdAt, "dd/MM/yyyy")}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                {" "}
                <Link href={`/product-group/${productGroup._id}`}>
                  <Button>View Products</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
