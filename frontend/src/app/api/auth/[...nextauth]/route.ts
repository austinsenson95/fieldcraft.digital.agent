import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const authResult = NextAuth(authOptions as any);

export const { GET, POST } = authResult.handlers;
