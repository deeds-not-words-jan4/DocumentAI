'use client'

import { useRouter } from 'next/navigation'
import RecipeForm from '@/components/RecipeForm'
import { RecipeFormData } from '@/types/recipe'

export default function NewRecipePage() {
  const router = useRouter()

  const handleSubmit = async (data: RecipeFormData) => {
    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('レシピの登録に失敗しました')
      }

      alert('レシピを登録しました')
      router.push('/recipes')
    } catch (error) {
      console.error('Error submitting recipe:', error)
      alert('エラーが発生しました')
    }
  }

  const handleCancel = () => {
    router.push('/recipes')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">レシピ新規登録</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <RecipeForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitLabel="登録"
          />
        </div>
      </div>
    </div>
  )
}
