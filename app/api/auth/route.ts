import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PASSKEY, AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE } from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { passkey: string };

  if (body.passkey !== PASSKEY) {
    return NextResponse.json({ error: "Invalid passkey" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ success: true });
}
