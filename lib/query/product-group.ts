import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../api-client";
import type { ApiResponse } from "../definition";

import { queryClient } from "@/app/provider";

export type ProductGroup = {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  productCount: number;
  totalAmount: number;
  totalCost: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
export type ProductGroupBody = {
  name: string;
  description?: string;
};

export function useProductGroup() {
  return useQuery({
    queryKey: ["product-group"],
    queryFn: async () => {
      return api.get<ApiResponse<ProductGroup[]>>(`/api/product-group`);
    },
  });
}

export function useCreateProductGroup() {
  return useMutation({
    mutationFn: async (productGroup: ProductGroupBody) => {
      return api.post<ApiResponse<ProductGroup>>(
        `/api/product-group`,
        productGroup,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-group"] });
    },
  });
}

export function useUpdateProductGroup(groupid: string) {
  return useMutation({
    mutationFn: async (productGroup: ProductGroupBody) => {
      return api.put<ApiResponse<ProductGroup>>(
        `/api/product-group/${groupid}`,
        productGroup,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-group"] });
    },
  });
}

export function useDeleteProductGroup(groupid: string) {
  return useMutation({
    mutationFn: async () => {
      return api.delete<ApiResponse<ProductGroup>>(
        `/api/product-group/${groupid}`,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-group"] });
    },
  });
}
