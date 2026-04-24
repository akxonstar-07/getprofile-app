import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.hashedPassword) {
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    newUser: "/onboarding", // Redirects new users to onboarding immediately
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role;
        (session.user as any).username = token.username;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      // 1. Initial Login Case: Pass user role into the token
      if (user) {
        token.sub = user.id;
        token.role = (user as any).role;
        token.username = (user as any).username;
      } 
      
      // 2. Dynamic Update Case: Fetch fresh data from DB if role is missing or manually trigger update
      if (token.sub && !token.role) {
        try {
          const freshUser = await prisma.user.findUnique({
            where: { id: token.sub as string },
            select: { role: true, username: true }
          });
          if (freshUser) {
            token.role = freshUser.role;
            token.username = freshUser.username;
          }
        } catch (error) {
          console.error("Failed to fetch fresh user role in JWT callback:", error);
          // Don't crash the login flow if DB is temporarily unreachable
        }
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
