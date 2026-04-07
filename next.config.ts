import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ビルド時のESLintチェック（書き方のルールチェック）を無視する
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ビルド時のTypeScript型エラーを無視して進める
    ignoreBuildErrors: true,
  },
  /* 他のオプションがあればここに追加 */
};

export default nextConfig;