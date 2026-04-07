import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/app/lib/auth"; 
import ReviewForm from '@/app/components/ReviewForm';
import type { Review, User } from '@prisma/client';

// PrismaのReview型にUser情報を含めた新しい型を定義
type ReviewWithUser = Review & {
  user: User;
};

const prisma = new PrismaClient();

// 作品詳細データを取得する関数 (変更なし)
async function getMovieData(id: string) {
  const url = `https://api.themoviedb.org/3/movie/${id}?language=ja-JP`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_API_READ_ACCESS_TOKEN}`,
    },
    next: { revalidate: 3600 },
  };
  const res = await fetch(url, options);
  if (!res.ok) return null;
  return res.json();
}

// 作品の出演者情報を取得する関数 (変更なし)
async function getMovieCredits(id: string) {
  const url = `https://api.themoviedb.org/3/movie/${id}/credits?language=ja-JP`;
  const options = { /* ... */ }; // 省略 (内容は同じ)
  const res = await fetch(url, options);
  if (!res.ok) return null;
  const data = await res.json();
  return data.cast;
}

// ページコンポーネント
export default async function MovieDetailPage({ params }:{ params: Promise<{ id: string }> }) {
  const { id } = await params; // paramsからidを取得

  // 必要なデータを並行して取得
  const [movie, credits, reviews, session] = await Promise.all([
    getMovieData(id),
    getMovieCredits(id),
    prisma.review.findMany({
      where: { movieId: Number(id) },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    }),
    getServerSession(authOptions), // サーバーサイドでセッション情報を取得
  ]);

  // 映画データが見つからない場合は404ページを表示
  if (!movie) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* 左側: ポスター画像 */}
        <div className="md:w-1/3 flex-shrink-0">
          <img
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/no-image.png'}
            alt={movie.title}
            className="w-full max-w-xs mx-auto md:max-w-none h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* 右側: 作品情報 */}
        <div className="md:w-2/3">
          <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
          <p className="text-lg text-gray-500 mb-4">{movie.release_date} 公開</p>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">あらすじ</h2>
            <p className="text-base leading-relaxed">{movie.overview || 'あらすじ情報はありません。'}</p>
          </div>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">ジャンル</h2>
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre: any) => (
                <span key={genre.id} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">{genre.name}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 出演者情報 */}
      {credits && credits.length > 0 && (
        <div className="mt-12">
          {/* ... 出演者情報の表示*/}
        </div>
      )}

      {/* レビュー追加*/}
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6">レビュー</h2>
        {session?.user ? (
          <ReviewForm movieId={id} />
        ) : (
          <p className="text-center bg-slate-300 p-4 rounded-lg">
            レビューを投稿するには
            <Link href="/api/auth/signin" className="text-blue-400 hover:underline font-bold ml-2">ログイン</Link>
            してください。
          </p>
        )}
        <div className="mt-8 space-y-6">
          {reviews.length > 0 ? (
            reviews.map((review: ReviewWithUser) => (
              <div key={review.id} className="bg-slate-300 p-4 rounded-lg flex items-start space-x-4">
                <img 
                  src={review.user.image || '/no-avatar.png'}
                  alt={review.user.name || 'avatar'}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-semibold">{review.user.name}</p>
                    <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString('ja-JP')}</p>
                  </div>
                  <p className="text-yellow-400 text-lg">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
                  <p className="mt-2 text-gray-700 whitespace-pre-wrap">{review.comment}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 mt-8">まだレビューはありません。</p>
          )}
        </div>
      </div>
    </div>
  );
}