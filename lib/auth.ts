import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Plan, UserRole } from "@prisma/client";
import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const providers = [
  ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
    ? [
        Google({
          clientId: process.env.AUTH_GOOGLE_ID,
          clientSecret: process.env.AUTH_GOOGLE_SECRET
        })
      ]
    : []),
  Credentials({
    name: "Email e senha",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Senha", type: "password" }
    },
    async authorize(credentials) {
      const parsed = credentialsSchema.safeParse(credentials);

      if (!parsed.success) {
        return null;
      }

      const user = await prisma.user.findUnique({
        where: { email: parsed.data.email.toLowerCase() }
      });

      if (!user?.passwordHash) {
        return null;
      }

      const passwordMatches = await compare(parsed.data.password, user.passwordHash);

      if (!passwordMatches) {
        return null;
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        plan: user.plan
      };
    }
  })
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers,
  pages: {
    signIn: "/login"
  },
  callbacks: {
    async jwt({ token, user }) {
      const email = user?.email ?? token.email;

      if (!email) {
        return token;
      }

      const dbUser = await prisma.user.findUnique({
        where: { email },
        select: { id: true, role: true, plan: true, image: true, name: true }
      });

      if (dbUser) {
        token.id = dbUser.id;
        token.role = dbUser.role;
        token.plan = dbUser.plan;
        token.picture = dbUser.image ?? token.picture;
        token.name = dbUser.name ?? token.name;
      }

      return token;
    },
    async session({ session, token }) {
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
  },
  events: {
    async createUser({ user }) {
      if (!user.id) {
        return;
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          role: "CLIENT",
          plan: "FREE"
        }
      });
    }
  }
});
