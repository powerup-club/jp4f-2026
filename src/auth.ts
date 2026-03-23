import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { getAuthSecret, getGoogleClientId, getGoogleClientSecret } from "@/admin/config";

const googleClientId = getGoogleClientId();
const googleClientSecret = getGoogleClientSecret();
const authSecret =
  getAuthSecret() || (process.env.NODE_ENV === "production" ? undefined : "Innov'Industry-admin-dev-secret");

export const { handlers, auth } = NextAuth({
  trustHost: true,
  secret: authSecret,
  session: {
    strategy: "jwt"
  },
  providers:
    googleClientId && googleClientSecret
      ? [
          Google({
            clientId: googleClientId,
            clientSecret: googleClientSecret
          })
        ]
      : [],
  pages: {
    signIn: "/auth/login",
    error: "/auth/login"
  },
  callbacks: {
    async signIn({ user, profile }) {
      const email = user.email?.trim().toLowerCase();
      if (!email) {
        return false;
      }

      const emailVerified =
        typeof profile === "object" && profile && "email_verified" in profile
          ? Boolean((profile as { email_verified?: unknown }).email_verified)
          : true;

      return emailVerified;
    },
    async session({ session }) {
      if (session.user?.email) {
        session.user.email = session.user.email.toLowerCase();
      }

      return session;
    }
  }
});
