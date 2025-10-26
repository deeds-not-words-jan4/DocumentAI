'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Recipe } from '@/types/recipe'
import Link from 'next/link'

export default function RecipeDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecipe()
  }, [id])

  const fetchRecipe = async () => {
    try {
      const response = await fetch(`/api/recipes/${id}`)
      if (!response.ok) {
        throw new Error('レシピの取得に失敗しました')
      }

      const data = await response.json()
      setRecipe(data)
    } catch (error) {
      console.error('Error fetching recipe:', error)
      alert('レシピの取得に失敗しました')
      router.push('/recipes')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('本当に削除しますか？')) {
      return
    }

    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('レシピの削除に失敗しました')
      }

      alert('レシピを削除しました')
      router.push('/recipes')
    } catch (error) {
      console.error('Error deleting recipe:', error)
      alert('レシピの削除に失敗しました')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    )
  }

  if (!recipe) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-4">
          <Link href="/recipes" className="text-blue-600 hover:text-blue-700">
            ← レシピ一覧に戻る
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* ヘッダー */}
          <div className="p-6 border-b">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold">{recipe.name}</h1>
              <div className="flex gap-2">
                <Link
                  href={`/recipes/${id}/edit`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  編集
                </Link>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  削除
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded">
                {recipe.category}
              </span>
              {recipe.cookingTime && (
                <span>調理時間: {recipe.cookingTime}分</span>
              )}
              {recipe.servings && <span>{recipe.servings}人分</span>}
            </div>

            {recipe.tags && (
              <div className="mt-3">
                <span className="text-sm text-gray-500">タグ: {recipe.tags}</span>
              </div>
            )}
          </div>

          {/* 画像 */}
          {recipe.imageUrl && (
            <div className="w-full">
              <img
                src={recipe.imageUrl}
                alt={recipe.name}
                className="w-full h-80 object-cover"
              />
            </div>
          )}

          {/* 材料 */}
          <div className="p-6 border-b">
            <h2 className="text-2xl font-semibold mb-4">材料</h2>
            <div className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <div key={index} className="flex justify-between">
                  <span>{ingredient.name}</span>
                  <span className="text-gray-600">{ingredient.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 調理手順 */}
          <div className="p-6 border-b">
            <h2 className="text-2xl font-semibold mb-4">調理手順</h2>
            <div className="space-y-4">
              {recipe.steps.map((step) => (
                <div key={step.order} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    {step.order}
                  </div>
                  <p className="flex-1 pt-1">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* メモ */}
          {recipe.memo && (
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">メモ</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{recipe.memo}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
