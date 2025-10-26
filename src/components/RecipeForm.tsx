'use client'

import { useState } from 'react'
import { RecipeFormData, Ingredient, Step, CATEGORIES } from '@/types/recipe'

type RecipeFormProps = {
  initialData?: RecipeFormData
  onSubmit: (data: RecipeFormData) => Promise<void>
  onCancel: () => void
  submitLabel?: string
}

export default function RecipeForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = '登録',
}: RecipeFormProps) {
  const [formData, setFormData] = useState<RecipeFormData>(
    initialData || {
      name: '',
      category: '和食',
      ingredients: [{ name: '', quantity: '' }],
      steps: [{ order: 1, description: '' }],
      cookingTime: undefined,
      servings: undefined,
      imageUrl: '',
      tags: '',
      memo: '',
    }
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { name: '', quantity: '' }],
    })
  }

  const handleRemoveIngredient = (index: number) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index),
    })
  }

  const handleIngredientChange = (
    index: number,
    field: keyof Ingredient,
    value: string
  ) => {
    const newIngredients = [...formData.ingredients]
    newIngredients[index][field] = value
    setFormData({ ...formData, ingredients: newIngredients })
  }

  const handleAddStep = () => {
    setFormData({
      ...formData,
      steps: [
        ...formData.steps,
        { order: formData.steps.length + 1, description: '' },
      ],
    })
  }

  const handleRemoveStep = (index: number) => {
    const newSteps = formData.steps
      .filter((_, i) => i !== index)
      .map((step, i) => ({ ...step, order: i + 1 }))
    setFormData({ ...formData, steps: newSteps })
  }

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...formData.steps]
    newSteps[index].description = value
    setFormData({ ...formData, steps: newSteps })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 料理名 */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          料理名 <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* カテゴリ */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-2">
          カテゴリ <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          required
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* 材料 */}
      <div>
        <label className="block text-sm font-medium mb-2">
          材料 <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                placeholder="材料名"
                required
                value={ingredient.name}
                onChange={(e) =>
                  handleIngredientChange(index, 'name', e.target.value)
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="分量"
                required
                value={ingredient.quantity}
                onChange={(e) =>
                  handleIngredientChange(index, 'quantity', e.target.value)
                }
                className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  削除
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddIngredient}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            + 材料を追加
          </button>
        </div>
      </div>

      {/* 調理手順 */}
      <div>
        <label className="block text-sm font-medium mb-2">
          調理手順 <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {formData.steps.map((step, index) => (
            <div key={index} className="flex gap-2">
              <span className="flex items-center justify-center w-8 h-10 text-sm font-medium text-gray-600">
                {step.order}.
              </span>
              <textarea
                placeholder="手順を入力"
                required
                value={step.description}
                onChange={(e) => handleStepChange(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
              {formData.steps.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveStep(index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  削除
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddStep}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            + 手順を追加
          </button>
        </div>
      </div>

      {/* 調理時間・人数分 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="cookingTime" className="block text-sm font-medium mb-2">
            調理時間（分）
          </label>
          <input
            id="cookingTime"
            type="number"
            min="0"
            value={formData.cookingTime || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                cookingTime: e.target.value ? parseInt(e.target.value) : undefined,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="servings" className="block text-sm font-medium mb-2">
            人数分
          </label>
          <input
            id="servings"
            type="number"
            min="1"
            value={formData.servings || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                servings: e.target.value ? parseInt(e.target.value) : undefined,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 画像URL */}
      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium mb-2">
          画像URL
        </label>
        <input
          id="imageUrl"
          type="url"
          value={formData.imageUrl || ''}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* タグ */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium mb-2">
          タグ（カンマ区切り）
        </label>
        <input
          id="tags"
          type="text"
          value={formData.tags || ''}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="例: 簡単, 時短, ヘルシー"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* メモ */}
      <div>
        <label htmlFor="memo" className="block text-sm font-medium mb-2">
          メモ
        </label>
        <textarea
          id="memo"
          value={formData.memo || ''}
          onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* ボタン */}
      <div className="flex gap-4 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          disabled={isSubmitting}
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          disabled={isSubmitting}
        >
          {isSubmitting ? '送信中...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
