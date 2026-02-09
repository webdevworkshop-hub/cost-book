import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../api-client";
import type { ApiResponse } from "../definition";
import { queryClient } from "@/app/provider";
import type { ProductGroup } from "./product-group";

export type Product = {
  _id: string;
  userId: string;
  productGroupId: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type ProductResponse = {
  productGroupInfo: ProductGroup;
  products: Product[];
  totalAmount: number;
};

export type ProductBody = {
  name: string;
  description?: string;
  price: number;
  quantity: number;
};

export function useProducts(groupid: string) {
  return useQuery({
    queryKey: ["products", groupid],
    queryFn: async () => {
      return api.get<ApiResponse<ProductResponse>>(
        `/api/product-group/${groupid}`,
      );
    },
  });
}

export function useCreateProduct(groupid: string) {
  return useMutation({
    mutationFn: async (product: ProductBody) => {
      return api.post<ApiResponse<Product>>(
        `/api/product-group/${groupid}`,
        product,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", groupid] });
    },
  });
}

export function useUpdateProduct(groupid: string, id: string) {
  return useMutation({
    mutationFn: async (product: ProductBody) => {
      return api.put<ApiResponse<Product>>(
        `/api/product-group/${groupid}/${id}`,
        product,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", groupid] });
    },
  });
}

export function useDeleteProduct(groupid: string, id: string) {
  return useMutation({
    mutationFn: async () => {
      return api.delete<ApiResponse<Product>>(
        `/api/product-group/${groupid}/${id}`,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", groupid] });
    },
  });
}
