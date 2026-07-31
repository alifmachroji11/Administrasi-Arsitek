import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { getRepository } from "./server/db";
import { verifyPassword } from "./server/password";

const providers: NextAuthConfig["providers"] = [
  Credentials({
    name: "Email",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Kata Sandi", type: "password" },
    },
    async authorize(credentials) {
      const email = credentials?.email as string | undefined;
      const password = credentials?.password as string | undefined;
      if (!email || !password) return null;

      const repo = getRepository();
      const user = await repo.getUserByEmail(email);
      if (!user || !user.passwordHash) return null;

      const valid = await verifyPassword(password, user.passwordHash);
      if (!valid) return null;

      return { id: user.id, email: user.email, name: user.name };
    },
  }),
];

// Google OAuth is optional — only registered when credentials are configured,
// so the login screen doesn't show a broken button in dev.
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  // Vercel/serverless hosts don't always match AUTH_URL exactly (preview
  // deployments, custom domains) — trust the incoming request's host so
  // Google's redirect_uri lines up without hardcoding a URL per env.
  trustHost: true,
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.uid = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.uid as string;
      return session;
    },
    async signIn({ user, account }) {
      // Google sign-in: create a Notula account on first login (no password —
      // this user authenticates via Google only).
      if (account?.provider === "google" && user.email) {
        const repo = getRepository();
        const existing = await repo.getUserByEmail(user.email);
        if (!existing) {
          const created = await repo.createUser({ email: user.email, passwordHash: null, name: user.name ?? user.email });
          user.id = created.id;
        } else {
          user.id = existing.id;
        }
      }
      return true;
    },
  },
});
