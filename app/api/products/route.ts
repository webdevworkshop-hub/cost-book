import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export const runtime = "nodejs";

/* ADD PRODUCT */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await req.json();

  const product = await Product.create({
    userId: session?.user?.id,
    name: body.name,
    description: body.description,
    price: body.price,
  });

  return Response.json(product);
}
/* UPDATE PRODUCT */
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await req.json();

  const product = await Product.findByIdAndUpdate(body.id, {
    name: body.name,
    description: body.description,
    price: body.price
  });

  return Response.json(product);
}
/* DELETE PRODUCT */
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { id } = await req.json();

  const product = await Product.findByIdAndDelete(id);
  if (product) {
    return Response.json({ message: "Product deleted successfully" });
  }

  return Response.json({ error: "Product not found" }, { status: 404 });
}

/* GET PRODUCTS + TOTAL */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const products = await Product.find({
    userId: session?.user?.id,
  }).sort({ createdAt: -1 });

  const totalAmount = products.reduce(
    (sum, item) => sum + item.price,
    0
  );

  return Response.json({
    products,
    totalAmount,
  });
}
