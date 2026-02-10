import { serialize } from "cookie";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth_token")?.value;

  if (!token) {
    return Response.json(
      { isSuccess: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const cookie = serialize("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return Response.json(
    { isSuccess: true, message: "Logout successful" },
    { status: 200, headers: { "Set-Cookie": cookie } },
  );
}
