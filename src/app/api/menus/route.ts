import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 献立一覧取得 (GET /api/menus)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = {}

    // 日付範囲で絞り込み
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    } else if (startDate) {
      where.date = {
        gte: new Date(startDate),
      }
    } else if (endDate) {
      where.date = {
        lte: new Date(endDate),
      }
    }

    const menus = await prisma.menu.findMany({
      where,
      include: {
        recipe: true,
      },
      orderBy: {
        date: 'asc',
      },
    })

    return NextResponse.json(menus)
  } catch (error) {
    console.error('Error fetching menus:', error)
    return NextResponse.json(
      { error: '献立の取得に失敗しました' },
      { status: 500 }
    )
  }
}

// 献立新規登録 (POST /api/menus)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // バリデーション（レシピIDまたはメモのどちらかは必須）
    if (!body.recipeId && !body.memo) {
      return NextResponse.json(
        { error: 'レシピまたはメモを入力してください' },
        { status: 400 }
      )
    }

    if (!body.date) {
      return NextResponse.json(
        { error: '日付は必須です' },
        { status: 400 }
      )
    }

    // 日付の正規化（時刻を00:00:00に設定）
    const date = new Date(body.date)
    date.setHours(0, 0, 0, 0)

    // 同じ日付の献立が既に存在するかチェック
    const existingMenu = await prisma.menu.findUnique({
      where: { date },
    })

    if (existingMenu) {
      return NextResponse.json(
        { error: 'この日付には既に献立が登録されています' },
        { status: 400 }
      )
    }

    const menu = await prisma.menu.create({
      data: {
        recipeId: body.recipeId || null,
        date,
        memo: body.memo || null,
      },
      include: {
        recipe: true,
      },
    })

    return NextResponse.json(menu, { status: 201 })
  } catch (error) {
    console.error('Error creating menu:', error)
    return NextResponse.json(
      { error: '献立の登録に失敗しました' },
      { status: 500 }
    )
  }
}
