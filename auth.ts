import NextAuth from "next-auth"
import { SupabaseAdapter } from "@auth/supabase-adapter"
import jwt from "jsonwebtoken"
 
// For more information on each option (and a full list of options) go to
// https://authjs.dev/reference/core/types#authconfig

export const { handlers, auth, signIn, signOut } = NextAuth({
  // https://authjs.dev/getting-started/authentication/oauth
  providers: [],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qaWtjZHptcWR0aHhrZWt6dXFlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5MjI2NywiZXhwIjoyMDY0MTY4MjY3fQ.5pCCwvJymfhfCcus7wvp7AN2v5EpR0Zo9F2rJ2f9n_c",
  }),
  callbacks: {
    async session({ session, user }) {
      const signingSecret = process.env.SUPABASE_JWT_SECRET
      if (signingSecret) {
        const payload = {
          aud: "authenticated",
          exp: Math.floor(new Date(session.expires).getTime() / 1000),
          sub: user.id,
          email: user.email,
          role: "authenticated",
        }
        session.supabaseAccessToken = jwt.sign(payload, signingSecret)
      }
      return session
    },
  },
})