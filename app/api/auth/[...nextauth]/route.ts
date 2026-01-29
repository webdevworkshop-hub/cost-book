import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs"; // IMPORTANT for Bun

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
