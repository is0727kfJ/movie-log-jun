import NextAuth, { type AuthOptions } from "next-auth" // AuthOptionsをインポート
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client" 

const prisma = new PrismaClient()

// NextAuthのメイン設定オブジェクトを定義
const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// 設定を使ってハンドラを初期化
const handler = NextAuth(authOptions)

// GETとPOSTリクエストをエクスポート
export { handler as GET, handler as POST }

// 他のファイルからセッションを取得するためにauthOptionsをエクスポート
export { authOptions }