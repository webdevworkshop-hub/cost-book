import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { getAuthUser } from "../../../auth/auth-token";
import type { NextRequest } from "next/server";

/* UPDATE PRODUCT */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const user = await getAuthUser();
  await connectDB();

  const body = await req.json();

  const product = await Product.findOneAndUpdate(
    {
      _id: id,
      userId: user.id,
    },
    {
      name: body.name,
      description: body.description,
      price: body.price,
      quantity: body.quantity,
      totalAmount: body.price * body.quantity,
    },
    { new: true },
  );

  if (!product) {
    return Response.json(
      { error: "Product not found or unauthorized" },
      { status: 404 },
    );
  }

  return Response.json(product);
}
/* DELETE PRODUCT */
export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await getAuthUser();
  await connectDB();

  const product = await Product.findOneAndDelete({
    _id: id,
    userId: user.id,
  });

  if (!product) {
    return Response.json(
      { error: "Product not found or unauthorized" },
      { status: 404 },
    );
  }

  return Response.json({ message: "Product deleted successfully" });
}
