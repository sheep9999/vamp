// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import type { Adapter } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: null, // Don't store email for privacy
          image: profile.avatar_url,
          username: profile.login,
          github: `https://github.com/${profile.login}`,
          role: null, // Will be set during onboarding
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // On initial sign in, get role from user
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true, username: true },
        });
        token.id = user.id;
        token.role = dbUser?.role || null;
        token.username = dbUser?.username || null;
      }
      
      // On session update, refresh role from database
      if (trigger === "update") {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true, username: true },
        });
        token.role = dbUser?.role || null;
        token.username = dbUser?.username || null;
      }
      
      return token;
    },
    
    async session({ session, token, user }) {
      // For JWT strategy: get data from token
      if (token) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
        (session.user as any).username = token.username;
        // Remove email from session for privacy
        delete (session.user as any).email;
      }
      
      // For database strategy: get data from user
      if (user) {
        session.user.id = user.id;
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true, username: true },
        });
        (session.user as any).role = dbUser?.role || null;
        (session.user as any).username = dbUser?.username || null;
        // Remove email from session for privacy
        delete (session.user as any).email;
      }
      
      return session;
    },
    
    async signIn({ user, account, profile }) {
      // Allow sign in - user will be created/updated by Prisma adapter
      return true;
    },
    
    async redirect({ url, baseUrl }) {
      // Always redirect to home after sign in
      // The OnboardingCheck component will handle onboarding redirect
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  events: {
    async createUser({ user }) {
      // When a new user is created
      console.log("New user created:", user.id);
    },
  },

  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },

  session: {
    strategy: "jwt", // Changed to JWT for better client-side access
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
