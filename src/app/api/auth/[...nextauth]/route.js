
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("No user found");

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid credentials");

        return { id: user._id, name: user.name, email: user.email, type: user.type };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow Google sign-in
      if (account.provider === "google") {
        return true;
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Use NEXTAUTH_URL if set, otherwise fall back to baseUrl
      const redirectBase = process.env.NEXTAUTH_URL || baseUrl;

      // If URL already starts with our base, use it as-is
      if (url.startsWith(redirectBase)) {
        return url;
      }

      // Default: redirect to google-callback page
      return `${redirectBase}/google-callback`;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
