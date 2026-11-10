import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./db";
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [Credentials({ name:"Login", credentials:{ email:{}, password:{} },
    async authorize(c) {
      if (!c?.email || !c.password) return null;
      const u = await db.user.findUnique({ where:{ email:c.email } });
      if (!u || !(await bcrypt.compare(c.password, u.password))) return null;
      return { id:u.id, name:u.name, email:u.email, role:u.role } as any;
    } })],
  callbacks: {
    jwt({ token, user }) { if (user) token.role = (user as any).role; return token; },
    session({ session, token }) { (session.user as any).role = token.role; (session.user as any).id = token.sub; return session; },
  },
  pages: { signIn: "/login" },
};
