import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

// 画像アップロード (POST /api/upload)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'ファイルが選択されていません' },
        { status: 400 }
      )
    }

    // ファイルタイプのチェック
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '画像ファイル（JPEG、PNG、GIF、WebP）のみアップロード可能です' },
        { status: 400 }
      )
    }

    // ファイルサイズのチェック（10MB）
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'ファイルサイズは10MB以下にしてください' },
        { status: 400 }
      )
    }

    // ファイル名を生成（タイムスタンプ + ランダム文字列 + 拡張子）
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split('.').pop()
    const filename = `recipes/${timestamp}-${randomString}.${extension}`

    // Vercel Blobにアップロード
    const blob = await put(filename, file, {
      access: 'public',
    })

    // 画像のURLを返す
    const imageUrl = blob.url

    return NextResponse.json({ imageUrl }, { status: 201 })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: '画像のアップロードに失敗しました' },
      { status: 500 }
    )
  }
}
