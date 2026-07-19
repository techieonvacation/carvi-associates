import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  type SessionUser,
  verifyPassword,
  verifySessionToken,
  SESSION_COOKIE,
} from "@/lib/session";

export type { SessionUser } from "@/lib/session";
export {
  clearSessionCookie,
  createSessionToken,
  getSessionFromRequest,
  hashPassword,
  requireAdmin,
  requireAuth,
  setSessionCookie,
  verifyPassword,
} from "@/lib/session";

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await verifySessionToken(token);
  if (!session) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { id: true, email: true, name: true, role: true },
  });
  if (!user) return null;
  return user satisfies SessionUser;
}

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  } satisfies SessionUser;
}
