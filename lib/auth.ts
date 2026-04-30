import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Discord from "next-auth/providers/discord";
import Google from "next-auth/providers/google";
import { z } from "zod";
import { jwtCallback, sessionCallback } from "@/lib/auth-callbacks";
import { getEmailVerificationIdentifier } from "@/lib/email-verification";
import { prisma } from "@/lib/prisma";
import { checkAuthRateLimit } from "@/lib/rate-limit";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128)
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
  ...(process.env.AUTH_DISCORD_ID && process.env.AUTH_DISCORD_SECRET
    ? [
        Discord({
          clientId: process.env.AUTH_DISCORD_ID,
          clientSecret: process.env.AUTH_DISCORD_SECRET,
          authorization: { params: { scope: "identify email" } }
        })
      ]
    : []),
  Credentials({
    name: "Email e senha",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Senha", type: "password" }
    },
    async authorize(credentials, request) {
      const limit = await checkAuthRateLimit(request, "login");

      if (!limit.success) {
        return null;
      }

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

      if (!user.emailVerified && user.email) {
        const pendingVerification = await prisma.verificationToken.findFirst({
          where: { identifier: getEmailVerificationIdentifier(user.email) },
          select: { identifier: true }
        });

        if (pendingVerification) {
          return null;
        }
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
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  providers,
  pages: {
    signIn: "/login"
  },
  callbacks: {
    jwt: jwtCallback,
    session: sessionCallback
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
