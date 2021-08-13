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

  callbacks: {
    async signIn(user, account, profile) {
      console.log("signIn:\n", user, account, profile);
      return true;
    },
    async redirect(url, baseUrl) {
      console.log("redirect:\n", url, baseUrl);
      return baseUrl;
    },
    async session(session, user) {
      console.log("session:\n", session, user);
      return session;
    },
    async jwt(token, user, account, profile, isNewUser) {
      console.log("jwt:\n", token, user, account, profile, isNewUser);
      return token;
    },
  },
});
