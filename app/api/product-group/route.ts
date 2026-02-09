// app/api/product-groups/route.ts
import { connectDB } from "@/lib/db";
import ProductGroup from "@/models/ProductGroup";
import { getAuthUser } from "../auth/auth-token";
import mongoose from "mongoose";
import type { NextRequest } from "next/server";

/* ADD PRODUCT GROUP */
export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  await connectDB();
  const body = await req.json();
  const productGroup = await ProductGroup.create({
    userId: user.id,
    name: body.name,
    description: body.description,
  });
  return Response.json(productGroup);
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    const userObjectId = new mongoose.Types.ObjectId(user.id);
    await connectDB();

    // Get query params
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const skip = (page - 1) * limit;

    const productGroups = await ProductGroup.aggregate([
      {
        $match: { userId: userObjectId }, // only current user's groups
      },
      {
        $lookup: {
          from: "products", // collection name (lowercase plural)
          localField: "_id",
          foreignField: "productGroupId",
          as: "products",
        },
      },
      {
        $addFields: {
          productCount: { $size: "$products" },
          totalCost: {
            $sum: "$products.totalAmount",
          },
        },
      },
      {
        $project: {
          products: 0, // remove products array from response
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    /* ---------- Total Count ---------- */
    const total = await ProductGroup.countDocuments({
      userId: userObjectId,
    });

    const pages = Math.ceil(total / limit);

    /* ---------- Pagination ---------- */
    const pagination = {
      page,
      limit,
      total,
      pages,
    };

    return Response.json({
      isSuccess: true,
      message: "Product groups fetched successfully",
      data: productGroups,
      meta: pagination,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return Response.json(
      { isSuccess: false, message: message },
      { status: 500 },
    );
  } finally {
    await mongoose.connection.close();
  }
}
