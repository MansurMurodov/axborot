import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
export default withAuth(
  (req) => { const role = (req.nextauth.token as any)?.role; const p = req.nextUrl.pathname;
    if (p.startsWith("/admin") && role !== "ADMIN") return NextResponse.redirect(new URL("/", req.url));
    if (p.startsWith("/teacher") && !["ADMIN","TEACHER"].includes(role)) return NextResponse.redirect(new URL("/", req.url)); },
  { callbacks: { authorized: ({ token }) => !!token } });
export const config = { matcher: ["/admin/:path*","/teacher/:path*","/student/:path*","/api/upload"] };
