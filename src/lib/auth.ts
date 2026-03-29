import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const ownerEmail = process.env.OWNER_EMAIL;
        const ownerPasswordHash = process.env.OWNER_PASSWORD_HASH;

        if (!credentials?.email || !credentials?.password) return null;
        if (credentials.email !== ownerEmail) return null;

        if (ownerPasswordHash) {
          const valid = await bcrypt.compare(
            credentials.password as string,
            ownerPasswordHash
          );
          if (!valid) return null;
        } else {
          // Fallback: plain text password comparison (dev only)
          if (credentials.password !== process.env.OWNER_PASSWORD) return null;
        }

        return {
          id: "owner",
          email: ownerEmail,
          name: "Owner",
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = "owner";
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.role) {
        (session.user as typeof session.user & { role: string }).role =
          token.role as string;
      }
      return session;
    },
  },
});
