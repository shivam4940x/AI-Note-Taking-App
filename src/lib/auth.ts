import prisma from "@/prisma/main.prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthClient } from "better-auth/client";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  // Allow requests from the frontend development server
  secret: process.env.BETTER_AUTH_SECRET || "abc",
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 5,
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      partitioned: true, // New browser standards will mandate this for foreign cookies
    },
  },
});

export const authClient = createAuthClient({
  fetchOptions: {
    credentials: "include",
  },
});
export type AuthType = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};
