import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/app/lib/auth"; 
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  // 1. ユーザーのセッション情報を取得
  const session = await getServerSession(authOptions);

  // 2. ログインしていない場合はエラー
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'ログインしてください。' }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    // 3. リクエストボディからデータを取得
    const { movieId, rating, comment } = await request.json();

    // 4. バリデーション
    if (!movieId || !rating) {
      return NextResponse.json({ error: '映画IDと評価は必須です。' }, { status: 400 });
    }

    // 5. データベースにレビューを保存
    const newReview = await prisma.review.create({
      data: {
        movieId: Number(movieId),
        rating: Number(rating),
        comment: comment,
        userId: userId,
      },
    });

    // 6. 成功レスポンスを返す
    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error('レビュー投稿エラー:', error);
    return NextResponse.json({ error: 'レビューの投稿に失敗しました。' }, { status: 500 });
  }
}