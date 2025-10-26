'use client'

import { useState, useEffect } from 'react'
import { Recipe } from '@/types/recipe'

type MenuDialogProps = {
  isOpen: boolean
  selectedDate: Date | null
  recipes: Recipe[]
  onClose: () => void
  onSubmit: (recipeId: string, date: Date) => Promise<void>
}

export default function MenuDialog({
  isOpen,
  selectedDate,
  recipes,
  onClose,
  onSubmit,
}: MenuDialogProps) {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setSelectedRecipeId('')
    }
  }, [isOpen])

  if (!isOpen || !selectedDate) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRecipeId) return

    setIsSubmitting(true)
    try {
      await onSubmit(selectedRecipeId, selectedDate)
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">献立を登録</h2>
        <p className="text-gray-600 mb-6">{formatDate(selectedDate)}</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              レシピを選択 <span className="text-red-500">*</span>
            </label>
            {recipes.length === 0 ? (
              <div className="text-gray-500 py-4">
                レシピが登録されていません。
                <a href="/recipes/new" className="text-blue-600 hover:text-blue-700 ml-2">
                  レシピを登録する
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                {recipes.map((recipe) => (
                  <label
                    key={recipe.id}
                    className={`
                      flex items-center p-3 border rounded-md cursor-pointer
                      transition-colors
                      ${
                        selectedRecipeId === recipe.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="recipe"
                      value={recipe.id}
                      checked={selectedRecipeId === recipe.id}
                      onChange={(e) => setSelectedRecipeId(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{recipe.name}</div>
                      <div className="text-sm text-gray-600 flex gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                          {recipe.category}
                        </span>
                        {recipe.cookingTime && (
                          <span className="text-xs">{recipe.cookingTime}分</span>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isSubmitting}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              disabled={isSubmitting || !selectedRecipeId}
            >
              {isSubmitting ? '登録中...' : '登録'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
