import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// レシピ詳細取得 (GET /api/recipes/:id)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id: params.id },
    })

    if (!recipe) {
      return NextResponse.json(
        { error: 'レシピが見つかりません' },
        { status: 404 }
      )
    }

    // JSON文字列をパースして返す
    return NextResponse.json({
      ...recipe,
      ingredients: JSON.parse(recipe.ingredients),
      steps: JSON.parse(recipe.steps),
    })
  } catch (error) {
    console.error('Error fetching recipe:', error)
    return NextResponse.json(
      { error: 'レシピの取得に失敗しました' },
      { status: 500 }
    )
  }
}

// レシピ更新 (PUT /api/recipes/:id)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const recipe = await prisma.recipe.update({
      where: { id: params.id },
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

    return NextResponse.json(recipe)
  } catch (error) {
    console.error('Error updating recipe:', error)
    return NextResponse.json(
      { error: 'レシピの更新に失敗しました' },
      { status: 500 }
    )
  }
}

// レシピ削除 (DELETE /api/recipes/:id)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.recipe.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'レシピを削除しました' })
  } catch (error) {
    console.error('Error deleting recipe:', error)
    return NextResponse.json(
      { error: 'レシピの削除に失敗しました' },
      { status: 500 }
    )
  }
}
