import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../api-client";
import type { ApiResponse } from "../definition";
import { queryClient } from "@/app/provider";

export type Product = {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type ProductResponse = {
  products: Product[];
  totalAmount: number;
};

export type ProductBody = {
  name: string;
  description?: string;
  price: number;
};

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      return api.get<ApiResponse<ProductResponse>>("/api/products");
    },
  });
}

export function useCreateProduct() {
  return useMutation({
    mutationFn: async (product: ProductBody) => {
      return api.post<ApiResponse<Product>>("/api/products", product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct(id: string) {
  return useMutation({
    mutationFn: async (product: ProductBody) => {
      return api.put<ApiResponse<Product>>(`/api/products/${id}`, product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProduct(id: string) {
  return useMutation({
    mutationFn: async () => {
      return api.delete<ApiResponse<Product>>(`/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
