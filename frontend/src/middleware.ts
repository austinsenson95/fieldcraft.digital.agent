import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        // Protect /products page and /api/contact
        if (req.nextUrl.pathname.startsWith("/products") || req.nextUrl.pathname === "/api/contact") {
          return token !== null;
        }
        return true;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/products/:path*", "/api/contact"],
};
