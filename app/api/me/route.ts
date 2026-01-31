import { connectDB } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth_token")?.value;

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_secret",
    ) as {
      id: string;
    };

    await connectDB();
    const user = await User.findById(decoded.id).select("-password");

    return Response.json({ data: user });
  } catch (err) {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }
}
