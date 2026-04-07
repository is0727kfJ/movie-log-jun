import axios from 'axios';

// Axiosのインスタンスを作成
const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    accept: 'application/json',
    // 環境変数からアクセストークンを読み込む
    Authorization: `Bearer ${process.env.TMDB_API_READ_ACCESS_TOKEN}`
  }
});

/**
 * 人気の映画を取得する関数
 * @returns {Promise<any[]>} 映画のリスト
 */
export const getPopularMovies = async () => {
  try {
    const response = await tmdbApi.get('/movie/popular?language=ja-JP&page=1');
    return response.data.results;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    // エラーが発生した場合は空の配列を返すか、エラーをスローするか選択
    return []; 
  }
};

/**
 * キーワードで映画を検索する関数
 * @param {string} query - 検索キーワード
 * @returns {Promise<any[]>} 検索結果の映画リスト
 */
export const searchMovies = async (query: string) => {
  if (!query) {
    return [];
  }
  
  try {
    const response = await tmdbApi.get(`/search/movie?query=${encodeURIComponent(query)}&language=ja-JP&page=1`);
    // console.log(`response.data.resultsの中身 ${response.data.results}`);
    return response.data.results;
    
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};