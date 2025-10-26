import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// レシピ検索 (GET /api/recipes/search)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category')
    const tags = searchParams.get('tags')

    const where: any = {}

    // 料理名または材料で検索
    if (query) {
      where.OR = [
        { name: { contains: query } },
        { ingredients: { contains: query } },
      ]
    }

    // カテゴリで絞り込み
    if (category) {
      where.category = category
    }

    // タグで絞り込み
    if (tags) {
      where.tags = { contains: tags }
    }

    const recipes = await prisma.recipe.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(recipes)
  } catch (error) {
    console.error('Error searching recipes:', error)
    return NextResponse.json(
      { error: 'レシピの検索に失敗しました' },
      { status: 500 }
    )
  }
}
