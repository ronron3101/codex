import type { NextRequest } from "next/server";

export function isAdminAuthorized(secret: string | undefined): boolean {
  if (!secret || !process.env.ADMIN_SECRET) {
    return false;
  }
  return secret === process.env.ADMIN_SECRET;
}

export function isAdminRequestAuthorized(request: NextRequest): boolean {
  const token = request.headers.get("x-admin-token") ?? request.nextUrl.searchParams.get("token") ?? undefined;
  return isAdminAuthorized(token);
}
