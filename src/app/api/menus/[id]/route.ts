import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 献立詳細取得 (GET /api/menus/:id)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const menu = await prisma.menu.findUnique({
      where: { id: params.id },
      include: {
        recipe: true,
      },
    })

    if (!menu) {
      return NextResponse.json(
        { error: '献立が見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json(menu)
  } catch (error) {
    console.error('Error fetching menu:', error)
    return NextResponse.json(
      { error: '献立の取得に失敗しました' },
      { status: 500 }
    )
  }
}

// 献立更新 (PUT /api/menus/:id)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    // バリデーション
    if (!body.recipeId && !body.date) {
      return NextResponse.json(
        { error: '更新する項目を指定してください' },
        { status: 400 }
      )
    }

    const updateData: any = {}

    if (body.recipeId) {
      updateData.recipeId = body.recipeId
    }

    if (body.date) {
      const date = new Date(body.date)
      date.setHours(0, 0, 0, 0)
      updateData.date = date
    }

    const menu = await prisma.menu.update({
      where: { id: params.id },
      data: updateData,
      include: {
        recipe: true,
      },
    })

    return NextResponse.json(menu)
  } catch (error) {
    console.error('Error updating menu:', error)
    return NextResponse.json(
      { error: '献立の更新に失敗しました' },
      { status: 500 }
    )
  }
}

// 献立削除 (DELETE /api/menus/:id)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.menu.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: '献立を削除しました' })
  } catch (error) {
    console.error('Error deleting menu:', error)
    return NextResponse.json(
      { error: '献立の削除に失敗しました' },
      { status: 500 }
    )
  }
}
