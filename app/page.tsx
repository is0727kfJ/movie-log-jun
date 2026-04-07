import Link from "next/link";
import { getPopularMovies } from "./lib/tmdb";

// メインページのコンポーネント
export default async function HomePage() {
  const movies = await getPopularMovies();

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">人気の映画</h1>
      
      {/* 映画一覧をグリッドで表示 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie: any) => (
          <Link href={`/movie/${movie.id}`} key={movie.id} className="group">
            <div className="overflow-hidden rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h2 className="mt-2 text-md font-semibold truncate group-hover:text-blue-500">
              {movie.title}
            </h2>
            <p className="text-sm text-gray-500">{movie.release_date}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
