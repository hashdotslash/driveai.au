import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: { email: { label:"Email", type:"email" }, password: { label:"Password", type:"password" } },
      async authorize(c) {
        if (!c?.email || !c?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: c.email } });
        if (!user || !user.password) return null;
        const ok = await compare(c.password, user.password);
        return ok ? { id: user.id, email: user.email, name: user.name, role: user.role } as any : null;
      }
    }),
    Google({ clientId: process.env.GOOGLE_CLIENT_ID||"", clientSecret: process.env.GOOGLE_CLIENT_SECRET||"" }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) { if (user) token.role = (user as any).role || "USER"; return token; },
    async session({ session, token }) { (session as any).user.role = token.role; return session; }
  }
})
