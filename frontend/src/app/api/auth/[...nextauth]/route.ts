import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// NextAuthConfig is not re-exported from the package root in v5 beta,
// so derive it from the NextAuth function signature instead.
type NextAuthConfig = Parameters<typeof NextAuth>[0];

// authOptions is hand-typed with looser callback signatures, so the cast
// must go through unknown (as TS suggests) rather than asserting directly.
const authResult = NextAuth(authOptions as unknown as NextAuthConfig);

export const { GET, POST } = authResult.handlers;
