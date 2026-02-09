import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { getAuthUser } from "../../auth/auth-token";
import ProductGroup from "@/models/ProductGroup";
import mongoose from "mongoose";

/* ADD PRODUCT */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ groupid: string }> },
) {
  const user = await getAuthUser();
  const userId = new mongoose.Types.ObjectId(user.id);
  await connectDB();
  const { groupid } = await params;

  const productGroup = await ProductGroup.findOne({
    _id: groupid,
    userId: userId,
  });

  if (!productGroup) {
    return Response.json({ error: "Product group not found" }, { status: 404 });
  }

  const body = await req.json();

  const product = await Product.create({
    name: body.name,
    description: body.description,
    price: body.price,
    quantity: body.quantity,
    userId: userId,
    productGroupId: groupid,
    totalAmount: body.price * body.quantity,
  });

  return Response.json({
    data: product,
  });
}

/* GET PRODUCTS + TOTAL */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ groupid: string }> },
) {
  try {
    const user = await getAuthUser();
    await connectDB();
    const { groupid } = await params;

    const userObjectId = new mongoose.Types.ObjectId(user.id);
    const groupObjectId = new mongoose.Types.ObjectId(groupid);

    /* ---------- Pagination Params ---------- */
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    /* ---------- Check Group Ownership ---------- */
    const productGroup = await ProductGroup.findOne({
      _id: groupObjectId,
      userId: userObjectId,
    });

    if (!productGroup) {
      return Response.json(
        {
          isSuccess: false,
          message: "Product group not found",
        },
        { status: 404 },
      );
    }

    /* ---------- Products (Paginated) ---------- */
    const products = await Product.find({
      userId: userObjectId,
      productGroupId: groupObjectId,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    /* ---------- Total Count ---------- */
    const totalItems = await Product.countDocuments({
      userId: userObjectId,
      productGroupId: groupObjectId,
    });

    const totalPages = Math.ceil(totalItems / limit);

    /* ---------- Total Amount (All products, not paginated) ---------- */
    const totalAgg = await Product.aggregate([
      {
        $match: {
          userId: userObjectId,
          productGroupId: groupObjectId,
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalAmount = totalAgg[0]?.totalAmount || 0;

    /* ---------- Response ---------- */
    return Response.json({
      isSuccess: true,
      message: "Products fetched successfully",
      data: {
        productGroupInfo: {
          _id: productGroup._id,
          name: productGroup.name,
          description: productGroup.description,
          totalAmount: totalAmount,
          numberOfProducts: totalItems,
        },
        products,
      },
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    });
  } catch (error) {
    return Response.json(
      {
        isSuccess: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 },
    );
  }
}

/* UPDATE PRODUCT Gr*/
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ groupid: string }> },
) {
  const { groupid } = await params;
  const body = await req.json();
  const productGroup = await ProductGroup.findOneAndUpdate(
    { _id: groupid },
    body,
    { new: true },
  );
  return Response.json(productGroup);
}

/* DELETE PRODUCT */
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ groupid: string }> },
) {
  const user = await getAuthUser();
  await connectDB();

  const { groupid } = await params;
  const product = await Product.findOneAndDelete({
    _id: groupid,
    userId: user.id,
  });
  return Response.json(product);
}
