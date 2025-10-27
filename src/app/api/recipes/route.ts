import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// レシピ一覧取得 (GET /api/recipes)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const order = searchParams.get('order') || 'desc'
    const search = searchParams.get('search')
    const searchType = searchParams.get('searchType') || 'name'

    const where: any = {}

    // カテゴリフィルター
    if (category) {
      where.category = category
    }

    // 検索機能
    if (search) {
      switch (searchType) {
        case 'name':
          // 料理名で検索
          where.name = {
            contains: search,
          }
          break
        case 'tags':
          // タグで検索
          where.tags = {
            contains: search,
          }
          break
        case 'ingredients':
          // 材料で検索（JSON文字列内を検索）
          where.ingredients = {
            contains: search,
          }
          break
      }
    }

    const recipes = await prisma.recipe.findMany({
      where,
      orderBy: {
        [sortBy]: order,
      },
    })

    return NextResponse.json(recipes)
  } catch (error) {
    console.error('Error fetching recipes:', error)
    return NextResponse.json(
      { error: 'レシピの取得に失敗しました' },
      { status: 500 }
    )
  }
}

// レシピ新規登録 (POST /api/recipes)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // バリデーション
    if (!body.name || !body.category || !body.ingredients || !body.steps) {
      return NextResponse.json(
        { error: '必須項目が入力されていません' },
        { status: 400 }
      )
    }

    // 材料と調理手順をJSON文字列に変換
    const ingredients = JSON.stringify(body.ingredients)
    const steps = JSON.stringify(body.steps)

    const recipe = await prisma.recipe.create({
      data: {
        name: body.name,
        category: body.category,
        ingredients,
        steps,
        cookingTime: body.cookingTime || null,
        servings: body.servings || null,
        imageUrl: body.imageUrl || null,
        tags: body.tags || null,
        memo: body.memo || null,
      },
    })

    return NextResponse.json(recipe, { status: 201 })
  } catch (error) {
    console.error('Error creating recipe:', error)
    return NextResponse.json(
      { error: 'レシピの登録に失敗しました' },
      { status: 500 }
    )
  }
}
