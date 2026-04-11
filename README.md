Movie Log App
Next.js 15とPrismaを採用した、モダンな映画レビュー管理システムです。
TMDB APIから取得した最新の映画情報に対し、ユーザーがレビューを投稿・管理できるフルスタックWebアプリケーションです。
---------
デモURL
[https://movie-log-jun.vercel.app](https://movie-log-jun.vercel.app)
---------
# 技術スタック
Frontend / Backend
- Framework: Next.js 15 (App Router)
- Library: React 19
- Authentication: NextAuth.js (Google OAuth 2.0)
- Styling: Tailwind CSS
---------
Database / Infrastructure
- ORM: Prisma
- Database: Supabase (PostgreSQL)
- Hosting: Vercel
- API: TMDB (The Movie Database) API
---------
# 主な機能
- 映画検索・一覧: TMDB APIを利用したキーワード検索および人気映画の表示。
- Google ログイン: NextAuth.jsによるセキュアな認証システム。
- レビュー機能: ログインユーザーによる5段階評価とコメント投稿（CRUD操作）。
- 完全レスポンシブ対応: PC・タブレット・スマートフォン全てのデバイスに最適化。
---------
# 技術的ハイライト（課題解決）
このプロジェクトでは、最新技術の導入に伴う複数の技術的課題を解決しました。
1. Next.js 15 へのマイグレーション
Next.js 15から導入された「'params' と 'searchParams' の非同期化（Promise化）」にいち早く対応しました。
- 動的ルーティング（'[id]/page.tsx'）において、型定義を 'Promise' にラップし、'await' を用いて安全にデータを取得する構造へ刷新しました。
- クライアントコンポーネントにおける 'useSearchParams()' の利用に伴うビルドエラーを、'<Suspense>' 境界を適切に設定することで解決し、静的ページ生成の最適化を実現しました。

2. 本番環境における認証設定
Vercelのプレビュー環境と本番環境（Production）におけるリダイレクトURIの不一致を解決するため、Google Cloud コンソールのOAuth設定および 'NEXTAUTH_URL' の環境変数を高度に管理。
- 複数ドメインでの認証フローを理解し、セキュアなリダイレクト処理を実装しました。

 3. セキュリティ対策 (CVE-2025-66478)
React Server Components に関連する重大な RCE（リモートコード実行）脆弱性に対し、手動でのパッケージアップグレードとパッチ適用を迅速に実施。
- 依存関係のバージョン管理（'package.json'）の重要性を理解し、本番環境の安全性を担保しました。
-----------
データベース設計
Prisma を使用して以下のリレーションを構築しています。
- User: Google OAuth から取得したユーザー情報。
- Review: 各映画（'movieId'）に対してユーザーが紐づく 1:N の関係。
-----------
セットアップ
1. 環境変数の設定
'.env' ファイルを作成し、以下の項目を設定してください。
 env
# Database (Supabase)
-DATABASE_URL="your_prisma_accelerate_url"
-DIRECT_URL="your_supabase_direct_url"

# Authentication (Google Cloud)
-GOOGLE_CLIENT_ID="your_google_client_id"
-GOOGLE_CLIENT_SECRET="your_google_client_secret"
-NEXTAUTH_SECRET="your_nextauth_secret"
-NEXTAUTH_URL="http://localhost:3000"

# External API (TMDB)
TMDB_API_READ_ACCESS_TOKEN="your_tmdb_token"
---------
2. インストールと起動
# bash
-npm install
-npx prisma generate
-npm run dev
----------
 開発者
- 名前: 杉本 淳 (Jun Sugimoto)
- 所属: 立命館大学 情報理工学部 システムアーキテクトコース
- 関心分野: コンパイラ理論、バックエンドエンジニアリング、システムアーキテクチャ設計
