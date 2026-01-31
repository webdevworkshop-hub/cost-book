import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { getAuthUser } from "../auth/auth-token";

export const runtime = "nodejs";

/* ADD PRODUCT */
export async function POST(req: Request) {
  const user = await getAuthUser();

  await connectDB();
  const body = await req.json();

  const product = await Product.create({
    userId: user.id,
    name: body.name,
    description: body.description,
    price: body.price,
  });

  return Response.json(product);
}

/* GET PRODUCTS + TOTAL */
export async function GET() {
  const user = await getAuthUser();

  await connectDB();

  const products = await Product.find({
    userId: user.id,
  }).sort({ createdAt: -1 });

  const totalAmount = products.reduce((sum, item) => sum + item.price, 0);

  return Response.json({
    data: {
      products,
      totalAmount,
    },
    totalAmount,
  });
}
