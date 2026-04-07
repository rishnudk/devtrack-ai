import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getSessionWithRole() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  // Fetch role from DB (since session might not include it by default)
  const user = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  return {
    ...session,
    user: {
      ...session.user,
      role: user[0]?.role ?? "user",
    },
  };
}

export function isAdmin(session: Awaited<ReturnType<typeof getSessionWithRole>>) {
  return session?.user?.role === "admin";
}
