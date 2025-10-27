'use client'

import { useState } from 'react'

type ImageUploadProps = {
  currentImageUrl?: string
  onImageUploaded: (imageUrl: string) => void
}

export default function ImageUpload({
  currentImageUrl,
  onImageUploaded,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl || '')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // プレビュー表示
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)

    // アップロード処理
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '画像のアップロードに失敗しました')
      }

      const data = await response.json()
      onImageUploaded(data.imageUrl)
    } catch (error: any) {
      console.error('Error uploading image:', error)
      alert(error.message || '画像のアップロードに失敗しました')
      setPreviewUrl(currentImageUrl || '')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreviewUrl('')
    onImageUploaded('')
  }

  return (
    <div className="space-y-4">
      {/* ファイル選択ボタン */}
      <div>
        <label
          htmlFor="image-upload"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
        >
          {uploading ? 'アップロード中...' : '画像を選択'}
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
        <p className="text-xs text-gray-500 mt-2">
          JPEG、PNG、GIF、WebP形式（最大10MB）
        </p>
      </div>

      {/* プレビュー */}
      {previewUrl && (
        <div className="relative">
          <img
            src={previewUrl}
            alt="プレビュー"
            className="max-w-full h-auto max-h-64 rounded-md border border-gray-300"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
          >
            削除
          </button>
        </div>
      )}
    </div>
  )
}
