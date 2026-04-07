import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

// 元々のUser型を拡張
declare module 'next-auth' {
  /**
   * `useSession` や `getSession` から返されるセッションオブジェクトの型。
   */
  interface Session {
    user: {
      id: string; // idプロパティを追加
    } & DefaultSession['user'];
  }

  /**
   * データベースのUserモデルに対応する型。
   */
  interface User extends DefaultUser {
    id: string;
  }
}