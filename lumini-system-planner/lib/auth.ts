export function isAdminAuthorized(secret: string | undefined): boolean {
  if (!secret) {
    return false;
  }
  return secret === process.env.ADMIN_SECRET;
}
