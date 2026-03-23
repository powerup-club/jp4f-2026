import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const ALLOWED_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim());

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId    : process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      return ALLOWED_EMAILS.includes(user.email);
    },
    async session({ session }) {
      return session;
    },
  },
  pages: {
    signIn : "/admin/login",
    error  : "/admin/login",
  },
});

export { handler as GET, handler as POST };
