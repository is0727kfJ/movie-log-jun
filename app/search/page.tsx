import Link from "next/link";
import { searchMovies, getPopularMovies } from "../lib/tmdb"; 

// 1. searchParams を Promise で包むように修正
interface SearchPageProps {
  searchParams: Promise<{
    query?: string; // queryは存在しない場合もあるので ? をつけるのが安全です
  }>;
}

// コンポーネント自体は今の async のままで完璧です！
export default async function SearchPage({ searchParams }: SearchPageProps) {
  // 2. await して中身を取り出す（ここも今のままでOK！）
  const { query } = await searchParams;

  let movies;
  if (query) {
    movies = await searchMovies(query);
  } else {
    movies = await getPopularMovies();
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {query ? (
          <>
            検索結果: <span className="text-blue-500">{query}</span>
          </>
        ) : (
          "人気の映画"
        )}
      </h1>
      {/* 検索結果の表示部分*/}
      {movies && movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie: any) => (
            <Link href={`/movie/${movie.id}`} key={movie.id} className="group">
              <div className="overflow-hidden rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "/no-image.png"
                  }
                  alt={movie.title}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h2 className="mt-2 text-md font-semibold truncate group-hover:text-blue-500">
                {movie.title}
              </h2>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center">
          {query
            ? `「${query}」に一致する映画は見つかりませんでした。`
            : "映画を検索してください。"}
        </p>
      )}
    </main>
  );
}