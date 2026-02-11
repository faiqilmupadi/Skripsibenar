import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/features/auth/api/auth.server";

const protectedRoutes = ["/kepala-gudang", "/admin", "/api"];

export async function middleware(req: NextRequest) {
  if (!protectedRoutes.some((path) => req.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = req.cookies.get("session")?.value;
  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  const session = await verifySessionToken(token);
  if (!session) return NextResponse.redirect(new URL("/login", req.url));

  if (req.nextUrl.pathname.startsWith("/admin") && session.role !== "ADMIN_GUDANG") {
    return NextResponse.redirect(new URL("/kepala-gudang/dashboard-analisis", req.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/kepala-gudang/:path*", "/admin/:path*", "/api/:path*"] };
