import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../api-client";
import type { ApiResponse } from "../definition";
type RegisterData = {
  name: string;
  email: string;
  password: string;
};

type LoginData = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
};
export function useRegister() {
  return useMutation({
    mutationFn: async (data: RegisterData) => {
      return api.post<ApiResponse<RegisterData>>("/api/register", data);
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: async (data: LoginData) => {
      return api.post<ApiResponse<LoginData>>("/api/login", data);
    },
  });
}

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      return api.get<ApiResponse<User>>("/api/me");
    },
  });
}
