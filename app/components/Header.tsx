'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
// ▼▼▼ next-auth/reactからフックと関数をインポート ▼▼▼
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  // ▼▼▼ useSessionフックでセッション情報を取得 ▼▼▼
  const { data: session, status } = useSession();
  
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [isComposing, setIsComposing] = useState(false);

  useEffect(() => {
    setQuery(searchParams.get('query') || '');
  }, [searchParams]);

  useEffect(() => {
    if (isComposing) return;
    if (query === (searchParams.get('query') || '')) return;

    const timeoutId = setTimeout(() => {
      if (pathname === '/search') {
        router.replace(`/search?query=${query}`);
      } else {
        router.push(`/search?query=${query}`);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, isComposing, router, searchParams, pathname]);
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query === (searchParams.get('query') || '')) return;
    router.push(`/search?query=${query}`);
  };

  const searchInput = (
     <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        placeholder="映画を検索..."
        className="w-full px-4 py-2 rounded-full bg-slate-800 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder:text-slate-200"
      />
  );

  return (
    <header className="bg-slate-900 text-white shadow-md border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* 1. 左端のタイトル */}
        <div className="flex-shrink-0">
          <Link href="/" className="text-2xl font-bold hover:text-blue-400 transition-colors">
            MovieLog
          </Link>
        </div>
        
        {/* 2. 中央の検索エンジン (PC/Tablet) */}
        <div className="flex-1 flex justify-center px-4 hidden md:flex">
          <div className="w-full max-w-md">
            <form onSubmit={handleSearch}>
              {searchInput}
            </form>
          </div>
        </div>

        {/* 3. 右端のナビゲーション */}
        <div className="flex-shrink-0">
          <nav>
            <ul className="flex items-center space-x-6">
              <li>
                <Link href="/" className="hover:text-blue-400 transition-colors">
                  ホーム
                </Link>
              </li>
              {/* ▼▼▼ ログイン状態に応じたUI表示を追加 ▼▼▼ */}
              {status === 'loading' ? (
                // ローディング中
                <li><div className="w-8 h-8 rounded-full bg-slate-700 animate-pulse" /></li>
              ) : session ? (
                // ログインしている場合
                <>
                  <li>
                    <img src={session.user?.image || '/no-avatar.png'} alt="avatar" width={32} height={32} className="rounded-full" />
                  </li>
                  <li>
                    <button onClick={() => signOut()} className="hover:text-red-400 transition-colors">
                      ログアウト
                    </button>
                  </li>
                </>
              ) : (
                // ログインしていない場合
                <li>
                  <button onClick={() => signIn('google')} className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md transition-colors">
                    ログイン
                  </button>
                </li>
              )}
              {/* ▲▲▲ ここまで ▲▲▲ */}
            </ul>
          </nav>
        </div>
      </div>
      
      {/* スマホ用の検索エンジン */}
       <div className="md:hidden p-4 pt-0">
        <form onSubmit={handleSearch} className="w-full">
          {searchInput}
        </form>
      </div>
    </header>
  );
}