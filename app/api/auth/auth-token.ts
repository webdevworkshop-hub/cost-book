import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export type AuthUser = {
  id: string;
};

export async function getAuthUser(): Promise<AuthUser> {
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth_token")?.value;

  if (!token) {
    throw new Error("NO_TOKEN");
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_secret",
    ) as AuthUser;

    return decoded;
  } catch {
    throw new Error("INVALID_TOKEN");
  }
}
