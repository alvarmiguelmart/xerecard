import type { Plan, UserRole } from "@prisma/client";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { hasActiveContactAccess } from "@/lib/billing";
import { prisma } from "@/lib/prisma";

type CallbackUser = {
  email?: string | null;
};

export async function jwtCallback({
  token,
  user
}: {
  token: JWT;
  user?: CallbackUser;
}) {
  const email = user?.email ?? token.email;

  if (!email) {
    return token;
  }

  const dbUser = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      role: true,
      plan: true,
      planExpiresAt: true,
      stripeSubscriptionId: true,
      stripeSubscriptionStatus: true,
      image: true,
      name: true
    }
  });

  if (dbUser) {
    token.id = dbUser.id;
    token.role = dbUser.role;
    token.plan = hasActiveContactAccess(dbUser) ? dbUser.plan : "FREE";
    token.picture = dbUser.image ?? token.picture;
    token.name = dbUser.name ?? token.name;
  }

  return token;
}

export async function sessionCallback({
  session,
  token
}: {
  session: Session;
  token: JWT;
}) {
  if (session.user) {
    session.user.id = typeof token.id === "string" ? token.id : "";
    session.user.role =
      token.role === "PROFESSIONAL" ? "PROFESSIONAL" : ("CLIENT" satisfies UserRole);
    session.user.plan =
      token.plan === "ESSENTIAL" || token.plan === "PROFESSIONAL"
        ? (token.plan satisfies Plan)
        : ("FREE" satisfies Plan);
    session.user.name = typeof token.name === "string" ? token.name : null;
    session.user.image =
      typeof token.picture === "string" ? token.picture : null;
  }

  return session;
}
