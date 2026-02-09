"use client";
import { useUser } from "@/lib/query/auth";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import ProductGroup from "./product-group";

export const CostBook = () => {
  const router = useRouter();
  const { data: user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && (!user || !user.data)) {
      router.push("/login");
    }
  }, [user, router, isLoading]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size={20} className="animate-spin" />
        <span>Loading...</span>
      </div>
    );

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Cost Book</h1>
      <p className="text-sm text-gray-500">Welcome {user?.data?.name}</p>

      <ProductGroup />
    </div>
  );
};
