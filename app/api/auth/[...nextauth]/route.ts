// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import { authOptions } from "@/app/lib/auth" // ステップ1で作ったファイルを読み込む

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }