'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import RecipeForm from '@/components/RecipeForm'
import { Recipe, RecipeFormData } from '@/types/recipe'

export default function EditRecipePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [initialData, setInitialData] = useState<RecipeFormData | null>(null)
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

      const recipe: Recipe = await response.json()
      setInitialData({
        name: recipe.name,
        category: recipe.category,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        cookingTime: recipe.cookingTime || undefined,
        servings: recipe.servings || undefined,
        imageUrl: recipe.imageUrl || undefined,
        tags: recipe.tags || undefined,
        memo: recipe.memo || undefined,
      })
    } catch (error) {
      console.error('Error fetching recipe:', error)
      alert('レシピの取得に失敗しました')
      router.push('/recipes')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: RecipeFormData) => {
    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('レシピの更新に失敗しました')
      }

      alert('レシピを更新しました')
      router.push(`/recipes/${id}`)
    } catch (error) {
      console.error('Error updating recipe:', error)
      alert('エラーが発生しました')
    }
  }

  const handleCancel = () => {
    router.push(`/recipes/${id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    )
  }

  if (!initialData) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">レシピ編集</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <RecipeForm
            initialData={initialData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitLabel="更新"
          />
        </div>
      </div>
    </div>
  )
}
