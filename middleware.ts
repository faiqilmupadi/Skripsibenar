import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/features/auth/api/auth.server";

const protectedRoutes = ["/dashboard", "/api"];

export async function middleware(req: NextRequest) {
  if (!protectedRoutes.some((x) => req.nextUrl.pathname.startsWith(x))) return NextResponse.next();
  const token = req.cookies.get("session")?.value;
  if (!token) return NextResponse.redirect(new URL("/login", req.url));
  const session = await verifySessionToken(token);
  if (!session) return NextResponse.redirect(new URL("/login", req.url));
  const adminOnly = req.nextUrl.pathname.startsWith("/dashboard/admin");
  if (adminOnly && session.role !== "ADMIN_GUDANG") return NextResponse.redirect(new URL("/", req.url));
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/api/:path*"] };
