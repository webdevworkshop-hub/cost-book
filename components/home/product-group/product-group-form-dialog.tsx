"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";
import { useState } from "react";
import {
  useCreateProductGroup,
  useUpdateProductGroup,
  type ProductGroup,
} from "@/lib/query/product-group";

const productGroupSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
});
export type ProductGroupFormValues = z.infer<typeof productGroupSchema>;

export const ProductGroupFormDialogWrapper = ({
  children,
  mode = "create",
  productGroup,
}: {
  children: React.ReactNode;
  mode?: "create" | "edit";
  productGroup?: ProductGroup;
}) => {
  const [open, setOpen] = useState(false);
  const form = useForm<ProductGroupFormValues>({
    resolver: zodResolver(productGroupSchema),
    defaultValues: {
      name: productGroup?.name || "",
      description: productGroup?.description || "",
    },
  });

  const { mutate: createProductGroup, isPending: isCreating } =
    useCreateProductGroup();
  const { mutate: updateProductGroup, isPending: isUpdating } =
    useUpdateProductGroup(productGroup?._id || "");

  const mutation = mode === "create" ? createProductGroup : updateProductGroup;
  const isPending = mode === "create" ? isCreating : isUpdating;

  function onSubmit(values: ProductGroupFormValues) {
    mutation(values, {
      onSuccess: () => {
        toast.success("Product Group saved successfully");
        form.reset();
        setOpen(false);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Product Group" : "Edit Product Group"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter Name " />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter Description" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
