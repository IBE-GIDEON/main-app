import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google, // only enable what has keys
  ],
  pages: {
    signIn: "/signin",
    error: "/auth-error",
  },
});
