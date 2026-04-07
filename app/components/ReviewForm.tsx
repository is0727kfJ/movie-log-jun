'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ReviewForm({ movieId }: { movieId: string }) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const res = await fetch('/api/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        movieId: movieId,
        rating: rating,
        comment: comment,
      }),
    });

    if (res.ok) {
      // 成功した場合: フォームをリセットし、ページを再読み込みして新しいレビューを表示
      setRating(0);
      setComment('');
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || 'レビューの投稿に失敗しました。');
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-300 p-6 rounded-lg shadow-md mt-8">
      <h3 className="text-2xl font-bold mb-4">レビューを投稿する</h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <div className="mb-4">
        <label htmlFor="rating" className="block mb-2">評価 (1-5)</label>
        <input
          id="rating"
          type="number"
          min="1"
          max="5"
          step="0.5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          required
          className="w-full p-2 rounded bg-slate-100 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="comment" className="block mb-2">コメント</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full p-2 rounded bg-slate-100 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-slate-600"
      >
        {isLoading ? '投稿中...' : '投稿'}
      </button>
    </form>
  );
}