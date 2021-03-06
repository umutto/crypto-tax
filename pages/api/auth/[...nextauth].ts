import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      scope: ["https://www.googleapis.com/auth/userinfo.profile"].join(" "),
    }),
  ],
  theme: "auto",
  pages: {
    error: "/error",
  },
  callbacks: {
    async signIn(user, account, profile) {
      if (
        process.env.NEXT_AUTH_RESTRICTED_TO &&
        profile.id !== process.env.NEXT_AUTH_RESTRICTED_TO
      ) {
        throw new Error("Restricted Access");
      }
      return true;
    },
    async redirect(url, baseUrl) {
      return baseUrl;
    },
    async session(session, user) {
      return session;
    },
    async jwt(token, user, account, profile, isNewUser) {
      return token;
    },
  },
});
