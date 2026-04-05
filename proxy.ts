import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE } from "@/lib/auth";

export function proxy(request: NextRequest) {
  const cookie = request.cookies.get(AUTH_COOKIE_NAME);
  const isAuthed = cookie?.value === AUTH_COOKIE_VALUE;

  if (request.nextUrl.pathname === "/") {
    if (isAuthed) {
      return NextResponse.redirect(new URL("/todo", request.url));
    }
    return NextResponse.next();
  }

  if (!isAuthed) {
    if (request.nextUrl.pathname.startsWith("/api/todos")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/todo/:path*", "/api/todos/:path*"],
};
