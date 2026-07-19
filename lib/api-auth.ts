import { NextResponse } from "next/server";
import { getSessionUser, requireAdmin } from "@/lib/auth";

export async function requireSession() {
  const user = await getSessionUser();
  if (!user) {
    return { user: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { user, response: null };
}

export async function requireAdminSession() {
  const { user, response } = await requireSession();
  if (response) return { user: null, response };
  if (!requireAdmin(user)) {
    return { user: null, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { user, response: null };
}
