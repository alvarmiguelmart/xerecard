import type { DefaultSession } from "next-auth";
import type { Plan, UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      plan: Plan;
    } & DefaultSession["user"];
  }

  interface User {
    role?: UserRole;
    plan?: Plan;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
    plan?: Plan;
  }
}
