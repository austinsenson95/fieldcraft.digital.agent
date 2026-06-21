import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // For Next-Auth v5 beta, auth is handled differently
  // This is a simplified middleware that allows all requests
  // The auth gate is handled at the page/component level
  return NextResponse.next();
}

export const config = {
  matcher: ["/products/:path*", "/api/contact"],
};
